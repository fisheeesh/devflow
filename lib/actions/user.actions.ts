'use server'

import { ActionResponse, ErrorResponse, PaginatedSearchParams, User as UserType } from "@/types/global";
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/error";
import { FilterQuery } from "mongoose";
import { User } from "@/database";
import { convertToPlainObject } from "../utils";

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