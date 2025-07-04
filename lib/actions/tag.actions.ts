'use server'

import { ActionResponse, ErrorResponse, PaginatedSearchParams, Tag as TagType } from "@/types/global"
import action from "../handlers/action"
import { PaginatedSearchParamsSchema } from "../validations"
import handleError from "../handlers/error"
import { FilterQuery } from "mongoose"
import { Tag } from "@/database"
import { convertToPlainObject } from "../utils"

export async function getTags(
    params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: TagType[], isNext: boolean }>> {
    const validationResult = await action({ params, schema: PaginatedSearchParamsSchema, authorize: true })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { page = 1, pageSize = 10, filter, query } = validationResult.params!
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    const filterQuery: FilterQuery<typeof Tag> = {}

    if (query) {
        filterQuery.$or = [{
            name: {
                $regex: query, $options: 'i'
            }
        }]
    }

    let sortCriteria = {}

    switch (filter) {
        case "popular":
            sortCriteria = { questions: -1 }
            break;
        case "recent":
            sortCriteria = { createdAt: -1 }
            break
        case 'oldest':
            sortCriteria = { createdAt: 1 }
            break
        case 'name':
            sortCriteria = { name: 1 }
            break
        default:
            sortCriteria = { questions: -1 }
            break
    }

    try {
        const totalTags = await Tag.countDocuments(filterQuery)

        const tags = await Tag.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)

        const isNext = totalTags > skip + tags.length

        return {
            success: true,
            data: {
                tags: convertToPlainObject(tags),
                isNext
            }
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}