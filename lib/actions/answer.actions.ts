'use server'

import Answer, { IAnswerDoc } from "@/database/answer.model";
import { CreateAnswerParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { AnswerServerSchema } from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question } from "@/database";
import { NotFoundError } from "../http-error";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";
import { convertToPlainObject } from "../utils";

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