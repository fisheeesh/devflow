"use server"

import Question from "@/database/question.model";
import TagQuestion, { ITagQuestion } from "@/database/tag-question.model";
import Tag, { ITagDoc } from "@/database/tag.model";
import { ActionResponse, ErrorResponse, Question as QuestionType } from "@/types/global";
import mongoose from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-error";
import { convertToPlainObject } from "../utils";
import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema } from "../validations";

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
                { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
                { $setOnInsert: { name: tag }, $inc: { question: 1 } },
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

export async function editQuestion(params: EditQuestionParms): Promise<ActionResponse<QuestionType>> {
    const validationResult = await action({ params, schema: EditQuestionSchema, authorize: true })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId, title, content, tags } = validationResult.params!
    const userId = validationResult!.session!.user!.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const question = await Question.findById(questionId).populate('tags')
        if (!question) throw new NotFoundError('Question')

        if (question.author.toString() !== userId) throw new UnauthorizedError('You are not authorized to edit this question')

        if (question.title !== title || question.content !== content) {
            question.title = title
            question.content = content
            await question.save({ session })
        }

        const tagsToAdd = tags.filter(tag => !question.tags.includes(tag.toLowerCase()))
        const tagsToRemove = question.tags.filter((tag: ITagDoc) => !tags.includes(tag.name.toLowerCase()))

        const newTagDocuments = []

        if (tagsToAdd.length > 0) {
            for (const tag of tags) {
                const existingTag = await Tag.findOneAndUpdate(
                    { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
                    { $setOnInsert: { name: tag }, $inc: { question: 1 } },
                    { upsert: true, new: true, session }
                )

                if (existingTag) {
                    newTagDocuments.push({
                        tag: existingTag._id,
                        question: questionId
                    })
                }

                question.tags.push(existingTag._id)
            }
        }

        if (tagsToRemove.length > 0) {
            const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id)

            await Tag.updateMany(
                { _id: { $in: tagIdsToRemove } },
                { $inc: { question: -1 } },
                { session }
            )

            await TagQuestion.deleteMany(
                { tag: { $in: tagIdsToRemove }, question: questionId }, { session }
            )

            question.tags = question.tags.filter(
                (tagId: mongoose.Types.ObjectId) => !tagIdsToRemove.includes(tagId)
            )
        }

        if (newTagDocuments.length > 0) {
            await TagQuestion.insertMany(newTagDocuments, { session })
        }

        await question.save({ session })

        await session.commitTransaction()

        return { success: true, data: convertToPlainObject(question), status: 200 }

    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }
}

export async function getQuestion(params: GetQuestionParams): Promise<ActionResponse<QuestionType>> {
    const validationResult = await action({ params, schema: GetQuestionSchema, authorize: true })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId } = validationResult.params!

    try {
        const question = await Question.findById(questionId).populate('tags')

        if (!question) throw new NotFoundError('Question')

        return { success: true, data: convertToPlainObject(question), status: 200 }
    }
    catch (error) {
        return handleError(error) as ErrorResponse
    }
}