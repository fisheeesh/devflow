'use server'

import ROUTES from "@/constants/routes";
import { Collection, Question } from "@/database";
import { CollectionBaseParams } from "@/types/action";
import { ActionResponse, Collection as CollectionType, ErrorResponse, PaginatedSearchParams } from "@/types/global";
import { revalidatePath } from "next/cache";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-error";
import { CollectionBaseSchema, PaginatedSearchParamsSchema } from "../validations";
import mongoose, { PipelineStage } from "mongoose";
import { convertToPlainObject } from "../utils";

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
        } else {
            await Collection.create({ author: userId, question: questionId })
        }

        revalidatePath(ROUTES.QUESTION(questionId))

        return { success: true, data: { saved: !!collection } }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function hasSavedQuestion(params: CollectionBaseParams): Promise<ActionResponse<{ saved: boolean }>> {
    const validationResult = await action({ params, schema: CollectionBaseSchema, authorize: true })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { questionId } = validationResult.params!
    const userId = validationResult!.session!.user!.id

    try {
        const collection = await Collection.findOne({
            author: userId,
            question: questionId
        })

        return { success: true, data: { saved: !!collection } }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function getSaveQuestion(params: PaginatedSearchParams): Promise<ActionResponse<{ collection: CollectionType[], isNext: boolean }>> {
    const validationResult = await action({ params, schema: PaginatedSearchParamsSchema, authorize: true })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const userId = validationResult!.session!.user!.id

    const { page = 1, pageSize = 10, filter, query } = validationResult.params!
    const skip = Number(page - 1) * pageSize
    const limit = Number(pageSize)

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
        mostrecent: { "question.createdAt": -1 },
        oldest: { "question.createdAt": 1 },
        mostvoted: { "question.upvotes": -1 },
        mostviewed: { "question.views": -1 },
        mostanswered: { "question.answers": -1 }
    }

    const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {
        "question.createdAt": -1
    }

    try {
        const pipeline: PipelineStage[] = [
            { $match: { author: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "questions",
                    localField: "question",
                    foreignField: "_id",
                    as: "question"
                }
            },
            { $unwind: "$question" },
            {
                $lookup: {
                    from: "users",
                    localField: "question.author",
                    foreignField: "_id",
                    as: "question.author"
                }
            },
            { $unwind: "$question.author" },
            {
                $lookup: {
                    from: "tags",
                    localField: "question.tags",
                    foreignField: "_id",
                    as: "question.tags"
                }
            }
        ]

        if (query) {
            pipeline.push({
                $match: {
                    $or: [
                        { "question.title": { $regex: query, $options: 'i' } },
                        { "question.content": { $regex: query, $options: 'i' } }
                    ]
                }
            })
        }

        const [totalCount] = await Collection.aggregate([
            ...pipeline, { $count: "count" }
        ])

        pipeline.push({ $sort: sortCriteria }, { $skip: skip }, { $limit: limit })
        pipeline.push({ $project: { question: 1, author: 1 } })

        const questions = await Collection.aggregate(pipeline)

        const isNext = totalCount.count > skip + questions.length

        return{
            success: true, 
            data: {
                collection: convertToPlainObject(questions),
                isNext
            }
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}
