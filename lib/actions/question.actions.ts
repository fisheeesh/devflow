"use server"

import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { Answer, Collection, Interaction, Vote } from "@/database";
import Question, { IQuestionDoc } from "@/database/question.model";
import TagQuestion, { ITagQuestion } from "@/database/tag-question.model";
import Tag, { ITagDoc } from "@/database/tag.model";
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionParams, IncrementViewsParams, RecommendationParams } from "@/types/action";
import { ActionResponse, ErrorResponse, PaginatedSearchParams, Question as QuestionType } from "@/types/global";
import mongoose, { FilterQuery, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { cache } from "react";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-error";
import dbConnect from "../mongoose";
import { convertToPlainObject } from "../utils";
import { AskQuestionSchema, DeleteQuestionSchema, EditQuestionSchema, GetQuestionSchema, IncrementViewsSchema, PaginatedSearchParamsSchema } from "../validations";
import { createInteraction } from "./interaction.actions";

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse<QuestionType>> {
    const validationResult = await action({ params, schema: AskQuestionSchema, authorize: true })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { title, content, tags } = validationResult.params!
    const userId = validationResult!.session!.user!.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const [question] = await Question.create(
            [{ title, content, author: userId }],
            { session }
        )
        if (!question) throw new Error('Failed to create question')

        const tagIds: mongoose.Types.ObjectId[] = []
        const tagQuestionDocuments: ITagQuestion[] = []

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: `^${tag}$`, $options: 'i' } },
                { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
                { upsert: true, new: true, session }
            )

            tagIds.push(existingTag._id)
            tagQuestionDocuments.push({
                tag: existingTag._id,
                question: question._id
            })
        }

        await TagQuestion.insertMany(tagQuestionDocuments, { session })

        await Question.findByIdAndUpdate(
            question._id,
            { $push: { tags: { $each: tagIds } } },
            { session }
        )

        //* log the interaction
        after(async () => {
            await createInteraction({
                action: "post",
                actionId: question._id.toString(),
                actionTarget: "question",
                authorId: userId as string,
            });
        });

        await session.commitTransaction()

        return { success: true, data: convertToPlainObject(question), status: 201 }

    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    }
    finally {
        await session.endSession()
    }
}

export async function editQuestion(
    params: EditQuestionParams
): Promise<ActionResponse<IQuestionDoc>> {
    const validationResult = await action({
        params,
        schema: EditQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { title, content, tags, questionId } = validationResult.params!;
    const userId = validationResult.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const question = await Question.findById(questionId).populate("tags");
        if (!question) throw new NotFoundError("Question");

        if (question.author.toString() !== userId) {
            throw new Error("You are not authorized to edit this question");
        }

        if (question.title !== title || question.content !== content) {
            question.title = title;
            question.content = content;
            await question.save({ session });
        }

        //* Determine tags to add and remove
        const tagsToAdd = tags.filter(
            (tag) =>
                !question.tags.some(
                    (t: ITagDoc) => t.name.toLowerCase() === tag.toLowerCase()
                )
        );

        const tagsToRemove = question.tags.filter(
            (tag: ITagDoc) =>
                !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
        );

        //* Add new tags
        const newTagDocuments = [];
        if (tagsToAdd.length > 0) {
            for (const tag of tagsToAdd) {
                const newTag = await Tag.findOneAndUpdate(
                    { name: { $regex: `^${tag}$`, $options: "i" } },
                    { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
                    { upsert: true, new: true, session }
                );

                if (newTag) {
                    newTagDocuments.push({ tag: newTag._id, question: questionId });
                    question.tags.push(newTag._id);
                }
            }
        }

        //* Remove tags
        if (tagsToRemove.length > 0) {
            const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

            await Tag.updateMany(
                { _id: { $in: tagIdsToRemove } },
                { $inc: { questions: -1 } },
                { session }
            );

            await TagQuestion.deleteMany(
                { tag: { $in: tagIdsToRemove }, question: questionId },
                { session }
            );

            question.tags = question.tags.filter(
                (tag: mongoose.Types.ObjectId) =>
                    !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
                        id.equals(tag._id)
                    )
            );
        }

        //* Insert new TagQuestion documents
        if (newTagDocuments.length > 0) {
            await TagQuestion.insertMany(newTagDocuments, { session });
        }

        //* Save the updated question
        await question.save({ session });
        await session.commitTransaction();

        return { success: true, data: JSON.parse(JSON.stringify(question)) };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}

export const getQuestion = cache(async function getQuestion(params: GetQuestionParams): Promise<ActionResponse<QuestionType>> {
    const validationResult = await action({ params, schema: GetQuestionSchema })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId } = validationResult.params!

    try {
        const question = await Question.findById(questionId)
            .populate('tags')
            .populate("author", "_id name image")

        if (!question) throw new NotFoundError('Question')

        return { success: true, data: convertToPlainObject(question), status: 200 }
    }
    catch (error) {
        return handleError(error) as ErrorResponse
    }
})

export async function getRecommendedQuestions({
    userId,
    query,
    skip,
    limit
}: RecommendationParams) {
    //* Get user's recent interactions
    const interaction = await Interaction.find({
        user: new Types.ObjectId(userId),
        actionType: "question",
        action: { $in: ['view', 'upvote', 'bookmark', 'post'] }
    })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean()

    const interactedQuestionIds = interaction.map(i => i.actionId)

    //* Get tags from interacted questions
    const interactedQuestions = await Question.find({
        _id: { $in: interactedQuestionIds }
    }).select("tags")

    /**
     * * flatMap -> which allows you to transform each item in an array
     * * and then flattern the result into in a single array
     * * const arr = [[1,2], [3,4]]
     * * arr.flatMap(x => x) 
     * * Output: [1,2,3,4]
     */
    //* Get unique tags
    const allTags = interactedQuestions.flatMap(q =>
        q.tags.map((tag: Types.ObjectId) => tag.toString())
    )

    //* Remove duplicates
    const uniqueTagIds = [...new Set(allTags)]

    const recommendedQuery: FilterQuery<typeof Question> = {
        //* exclude interacted questions
        _id: { $nin: interactedQuestionIds },
        //* exclude the user's own questions
        author: { $ne: new Types.ObjectId(userId) },
        //* include questions with any of the unique tags
        tags: { $in: uniqueTagIds.map((id: string) => new Types.ObjectId(id)) }
    }

    if (query) {
        recommendedQuery.$or = [
            { title: { $regex: query, $options: 'i' } },
        ]
    }

    const total = await Question.countDocuments(recommendedQuery)
    const questions = await Question.find(recommendedQuery)
        .populate("tags", "name")
        .populate("author", "_id name image")
        .sort({ upvotes: -1, views: -1 }) //* prioritizing engagement
        .skip(skip)
        .limit(limit)
        .lean()

    return {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext: total > skip + questions.length
    }
}

export async function getQuestions(params: PaginatedSearchParams): Promise<ActionResponse<{ questions: QuestionType[], isNext: boolean }>> {
    const validationResult = await action({ params, schema: PaginatedSearchParamsSchema })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { page = 1, pageSize = 10, query, filter } = validationResult.params!
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    const filterQuery: FilterQuery<typeof Question> = {}
    let sortCriteria = {}

    try {
        if (filter === "recommended") {
            const session = await auth();
            const userId = session?.user?.id;

            if (!userId) {
                return { success: true, data: { questions: [], isNext: false } };
            }

            const recommended = await getRecommendedQuestions({
                userId,
                query,
                skip,
                limit,
            });

            return { success: true, data: recommended };
        }

        if (query) {
            filterQuery.title = { $regex: query, $options: 'i' }
        }

        switch (filter) {
            case "newest":
                sortCriteria = { createdAt: -1 }
                break
            case "unanswered":
                filterQuery.answers = 0
                sortCriteria = { createdAt: -1 }
                break
            case "popular":
                sortCriteria = { upvotes: -1 }
                break
            default:
                sortCriteria = { createdAt: -1 }
                break
        }

        const totalQuestions = await Question.countDocuments(filterQuery)
        //* It'll convert this mongoDb doc into a plain js obj that makes it easier to work with
        const questions = await Question.find(filterQuery)
            .populate('tags', 'name')
            .populate('author', 'name image')
            .lean()
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)

        const isNext = totalQuestions > skip + questions.length

        return {
            success: true,
            data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function incrementViews(
    params: IncrementViewsParams
): Promise<ActionResponse<{ views: number }>> {
    const validationResult = await action({ params, schema: IncrementViewsSchema })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId } = validationResult.params!

    try {
        const question = await Question.findById(questionId)
        if (!question) throw new NotFoundError('Question')

        question.views += 1
        await question.save()

        return { success: true, data: { views: question.views } }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function getHotQuestions(): Promise<ActionResponse<QuestionType[]>> {
    try {
        await dbConnect()

        const questions = await Question.find()
            .sort({ views: -1, upvotes: -1 })
            .limit(6)

        return {
            success: true,
            data: convertToPlainObject(questions)
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function deleteQuestion(params: DeleteQuestionParams): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: DeleteQuestionSchema, authorize: true })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId } = validationResult.params!
    const userId = validationResult!.session!.user!.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        //* Handle the case where the question ID doesn’t exist in the database
        const question = await Question.findById(questionId).session(session)
        if (!question) throw new NotFoundError("Question")

        //* Ensure only the original creator can delete the question (frontend shows delete option, but backend must also verify)
        if (question.author.toString() !== userId) {
            throw new Error("You are not authorized to delete this question");
        }

        //* Remove the question from any user's Collection where it was saved
        await Collection.deleteMany(
            { question: questionId },
            { session }
        );

        //* Delete all related documents in TagQuestion
        await TagQuestion.deleteMany(
            { tag: { $in: question.tags }, question: questionId },
            { session }
        );

        //* Keep the tags, but decrement their questionCount by 1
        await Tag.updateMany(
            { _id: { $in: question.tags } },
            { $inc: { questions: -1 } },
            { session }
        );

        //* Delete all upvote/downvote documents related to this question
        await Vote.deleteMany({ actionId: questionId, actionType: 'question' }, { session })

        //* Get all answer IDs related to the question and delete their upvote/downvote relations too
        const answers = await Answer.find({ question: questionId }).session(session)
        if (answers.length > 0) {
            await Answer.deleteMany({ question: questionId }, { session })

            //* Delete all answers associated with the question
            await Vote.deleteMany({
                actionId: { $in: answers.map(a => a._id) },
                actionType: "answer"
            }, { session })
        }

        //* Finally, delete the question itself
        await Question.findByIdAndDelete(questionId, { session })

        after(async () =>
            await createInteraction({
                action: "delete",
                actionId: questionId.toString(),
                actionTarget: 'question',
                authorId: userId as string
            })
        )

        await session.commitTransaction()

        revalidatePath(ROUTES.PROFILE(userId as string))

        return { success: true }

    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }
}