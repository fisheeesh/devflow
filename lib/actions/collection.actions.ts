'use server'

import { CollectionBaseParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { CollectionBaseSchema } from "../validations";
import handleError from "../handlers/error";
import { Collection, Question } from "@/database";
import { NotFoundError } from "../http-error";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function toggleSaveQuestion(params: CollectionBaseParams): Promise<ActionResponse<{ saved: boolean }>> {
    const validationResult = await action({ params, schema: CollectionBaseSchema, authorize: true })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId } = validationResult.params!
    const userId = validationResult!.session!.user!.id

    try {
        const question = await Question.findById(questionId)
        if (!question) throw new NotFoundError('Question')

        const collection = await Collection.findOne({
            author: userId,
            question: questionId
        })

        if (collection) {
            await Collection.findOneAndDelete(collection._id)
            return { success: true, data: { saved: false } }
        }

        await Collection.create({ author: userId, question: questionId })

        revalidatePath(ROUTES.QUESTION(questionId))

        return { success: true, data: { saved: true } }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}