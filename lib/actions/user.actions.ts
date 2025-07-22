'use server'

import { Answer, Question, User } from "@/database";
import { GetUserAnswersParams, GetUserParams, GetUserQuestionsParams, GetUserTagsParams } from "@/types/action";
import { ActionResponse, Answer as AnswerType, ErrorResponse, PaginatedSearchParams, Question as QuestionType, Tag as TagType, User as UserType } from "@/types/global";
import { FilterQuery, PipelineStage, Types } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-error";
import { convertToPlainObject } from "../utils";
import { GetUserAnswersSchema, GetUserQuestionsSchema, GetUserSchema, GetUserTagsSchema, PaginatedSearchParamsSchema } from "../validations";

export async function getAllUsers(params: PaginatedSearchParams): Promise<ActionResponse<{ users: UserType[], isNext: boolean }>> {
    const validationResult = await action({ params, schema: PaginatedSearchParamsSchema })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { page = 1, pageSize = 10, filter, query } = validationResult.params!

    const skip = Number(page - 1) * pageSize
    const limit = Number(pageSize)

    const filterQuery: FilterQuery<typeof User> = {}

    if (query) {
        filterQuery.$or = [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ]
    }

    let sortCriteria = {}

    switch (filter) {
        case "newest":
            sortCriteria = { createdAt: -1 }
            break
        case "oldest":
            sortCriteria = { createdAt: 1 }
            break
        case "popular":
            sortCriteria = { reputation: -1 }
            break
        default:
            sortCriteria = { createdAt: -1 }
            break
    }

    try {
        const totalUsers = await User.countDocuments(filterQuery)
        const users = await User.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)

        const isNext = totalUsers > skip + users.length

        return {
            success: true,
            data: {
                users: convertToPlainObject(users),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function getUser(params: GetUserParams): Promise<ActionResponse<{
    user: UserType,
    totalQuestions: number,
    totalAnswers: number
}>> {
    const validtionResult = await action({ params, schema: GetUserSchema })
    if (validtionResult instanceof Error) {
        return handleError(validtionResult) as ErrorResponse
    }

    const { userId } = validtionResult.params!

    try {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User')

        const totalQuestions = await Question.countDocuments({ author: userId })
        const totalAnswers = await Answer.countDocuments({ author: userId })

        return {
            success: true,
            data: {
                user: convertToPlainObject(user),
                totalQuestions,
                totalAnswers
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function getUserQuestions(params: GetUserQuestionsParams): Promise<ActionResponse<{ questions: QuestionType[], isNext: boolean }>> {
    const validationResult = await action({ params, schema: GetUserQuestionsSchema })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { userId, page = 1, pageSize = 10 } = validationResult.params!
    const skip = Number(page - 1) * pageSize
    const limit = Number(pageSize)

    try {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User')

        const totalQuestions = await Question.countDocuments({ author: userId })
        const questions = await Question.find({ author: userId })
            .populate('tags', 'name')
            .populate('author', 'name image')
            .skip(skip)
            .limit(limit)

        const isNext = totalQuestions > skip + questions.length

        return {
            success: true,
            data: {
                questions: convertToPlainObject(questions),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function getUserAnswers(params: GetUserAnswersParams): Promise<ActionResponse<{ answers: AnswerType[], isNext: boolean }>> {
    const validationResult = await action({ params, schema: GetUserAnswersSchema })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { userId, page = 1, pageSize = 10 } = validationResult.params!
    const skip = Number(page - 1) * pageSize
    const limit = Number(pageSize)

    try {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User')

        const totalAnswers = await Answer.countDocuments({ author: userId })
        const answers = await Answer.find({ author: userId })
            .populate("author", "_id name image")
            .skip(skip)
            .limit(limit)

        const isNext = totalAnswers > skip + answers.length

        return {
            success: true,
            data: {
                answers: convertToPlainObject(answers),
                isNext
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

/**
 * * Show a list of top technologies that this user has something to do with.
 * * Either they were posting questions in that category, or they were showing their expertise by answering some questions within that tag.
 * * So we'll have to approach this by finding all the questions created by the users and then grouping them by their associated tags.
 * * From there, we'll find out which tags are more commonly used in each one of these questions and then return them.
 */
export async function getUserTags(params: GetUserTagsParams): Promise<ActionResponse<{ tags: { _id: string, name: string, count: number }[] }>> {
    const validationResult = await action({ params, schema: GetUserTagsSchema })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { userId } = validationResult.params!

    try {
        const pipeline: PipelineStage[] = [
            { $match: { author: new Types.ObjectId(userId) } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "tags",
                    localField: "_id",
                    foreignField: "_id",
                    as: "tagInfo"
                }
            },
            { $unwind: "$tagInfo" },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: "$tagInfo._id",
                    name: "$tagInfo.name",
                    count: 1
                }
            }
        ]

        const tags = await Question.aggregate(pipeline)

        return {
            success: true,
            data: {
                tags: convertToPlainObject(tags)
            }
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}