'use server'

import ROUTES from "@/constants/routes";
import { Answer, Question, User } from "@/database";
import { EditProfileParams, GetUserAnswersParams, GetUserParams, GetUserQuestionsParams, GetUserTagsParams } from "@/types/action";
import { ActionResponse, Answer as AnswerType, Badges, ErrorResponse, PaginatedSearchParams, Question as QuestionType, User as UserType } from "@/types/global";
import { FilterQuery, PipelineStage, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-error";
import { assignBagdes, convertToPlainObject } from "../utils";
import { EditProfileFormSchema, GetUserAnswersSchema, GetUserQuestionsSchema, GetUserSchema, GetUserTagsSchema, PaginatedSearchParamsSchema } from "../validations";

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

export const getUser = cache(async (params: GetUserParams): Promise<ActionResponse<{
    user: UserType,
}>> => {
    const validtionResult = await action({ params, schema: GetUserSchema })
    if (validtionResult instanceof Error) {
        return handleError(validtionResult) as ErrorResponse
    }

    const { userId } = validtionResult.params!

    try {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User')

        return {
            success: true,
            data: {
                user: convertToPlainObject(user),
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
})

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
            .sort({ createdAt: -1 })
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
            .sort({ createdAt: -1 })
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

        const tags = await Question.aggregate(pipeline).limit(10)

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

export async function getUserStats(params: GetUserParams): Promise<ActionResponse<{
    totalQuestions: number,
    totalAnswers: number,
    badges: Badges
}>> {
    const validationResult = await action({ params, schema: GetUserSchema })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { userId } = validationResult.params!

    try {
        const [questionStats] = await Question.aggregate([
            { $match: { author: new Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    upvotes: { $sum: "$upvotes" },
                    views: { $sum: "$views" }
                }
            }
        ])

        const [answerStats] = await Answer.aggregate([
            { $match: { author: new Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    upvotes: { $sum: "$upvotes" }
                }
            }
        ])

        const badges = assignBagdes({
            criteria: [
                { type: "QUESTION_COUNT", count: questionStats.count },
                { type: 'ANSWER_COUNT', count: answerStats.count },
                { type: 'QUESTION_UPVOTES', count: questionStats.upvotes + answerStats.upvotes },
                { type: "TOTAL_VIEWS", count: questionStats.views }
            ]
        })

        return {
            success: true,
            data: {
                totalQuestions: questionStats?.count ?? 0,
                totalAnswers: answerStats?.count ?? 0,
                badges
            }
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function editProfile(params: EditProfileParams): Promise<ActionResponse<{ user: UserType }>> {
    const validationResult = await action({ params, schema: EditProfileFormSchema, authorize: true })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    // const { name, username, portfolio, location, bio } = validationResult.params!
    const userId = validationResult!.session!.user!.id
    if (!userId) throw new NotFoundError('User')

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            params,
            { new: true }
        )
        if (!user) throw new Error('Something went wrong!.')

        revalidatePath(ROUTES.PROFILE(userId))

        return {
            success: true,
            data: {
                user: convertToPlainObject(user)
            }
        }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}