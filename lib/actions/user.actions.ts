'use server'

import { Answer, Question, User } from "@/database";
import { GetUserParams, GetUserQuestionsParams } from "@/types/action";
import { ActionResponse, ErrorResponse, PaginatedSearchParams, Question as QuestionType, User as UserType } from "@/types/global";
import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-error";
import { convertToPlainObject } from "../utils";
import { GetUserQuestionSchema, GetUserSchema, PaginatedSearchParamsSchema } from "../validations";

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
    const validationResult = await action({ params, schema: GetUserQuestionSchema })
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