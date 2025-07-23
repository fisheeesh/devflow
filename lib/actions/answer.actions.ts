'use server'

import ROUTES from "@/constants/routes";
import { Question, Vote } from "@/database";
import Answer, { IAnswerDoc } from "@/database/answer.model";
import { CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "@/types/action";
import { ActionResponse, Answer as AnswerType, ErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-error";
import { convertToPlainObject } from "../utils";
import { AnswerServerSchema, DeleteAnswerSchema, GetAnswersSchema } from "../validations";
import { after } from "next/server";
import { createInteraction } from "./interaction.actions";

export async function createAnswer(
    params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> {
    const validationResult = await action({ params, schema: AnswerServerSchema, authorize: true })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId, content } = validationResult.params!
    const userId = validationResult!.session!.user!.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const question = await Question.findById(questionId)
        if (!question) throw new NotFoundError('Question')

        const [newAnswer] = await Answer.create(
            [{ author: userId, question: questionId, content }],
            { session }
        )
        if (!newAnswer) throw new Error('Failed to create answer')

        question.answers += 1
        await question.save({ session })

        //* log the interaction
        after(async () => {
            await createInteraction({
                action: "post",
                actionId: newAnswer._id.toString(),
                actionTarget: "answer",
                authorId: userId as string,
            });
        });

        await session.commitTransaction()

        revalidatePath(ROUTES.QUESTION(questionId))

        return { success: true, data: convertToPlainObject(newAnswer), status: 201 }

    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }
}

export async function getAnswers(
    params: GetAnswersParams
): Promise<ActionResponse<{ answers: AnswerType[], isNext: boolean, totalAnswers: number }>> {
    const validationResult = await action({ params, schema: GetAnswersSchema })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId, page = 1, pageSize = 10, filter } = validationResult.params!
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    let sortCriteria = {}

    switch (filter) {
        case "latest":
            sortCriteria = { createdAt: -1 }
            break;
        case "oldest":
            sortCriteria = { createdAt: 1 }
            break;
        case "popular":
            sortCriteria = { upvotes: -1 }
            break
        default:
            sortCriteria = { createdAt: -1 }
            break
    }

    try {
        const totalAnswers = await Answer.countDocuments({ question: questionId })
        const answers = await Answer.find({ question: questionId })
            .populate('author', '_id name image')
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)

        const isNext = totalAnswers > skip + answers.length

        return { success: true, data: { answers: convertToPlainObject(answers), isNext, totalAnswers } }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function deleteAnswer(params: DeleteAnswerParams): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: DeleteAnswerSchema, authorize: true })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { answerId } = validationResult.params!
    const userId = validationResult!.session!.user!.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        //* Check if the answer actually exists
        const answer = await Answer.findById(answerId).session(session)
        if (!answer) throw new NotFoundError('Answer')

        //* Allow only the original author to delete it — not just any authenticated user
        if (answer.author.toString() !== userId) {
            throw new Error("You are not authorized to delete this answer");
        }

        //* Decrease the answer count for the associated question
        await Question.updateOne(
            { _id: answer.question },
            { $inc: { answers: -1 } },
            { new: true, session }
        );

        //* Remove all upvote/downvote documents linked to this answer
        await Vote.deleteMany(
            { actionId: answerId, actionType: 'answer' },
            { session }
        );

        //* And finally, delete the answer itself
        await Answer.deleteOne({ _id: answerId }, { session })

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