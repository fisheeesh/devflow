'use server'

import { ActionResponse, ErrorResponse, PaginatedSearchParams, Tag as TagType, Question as QuestionType } from "@/types/global"
import action from "../handlers/action"
import { GetTagQuestionsSchema, PaginatedSearchParamsSchema } from "../validations"
import handleError from "../handlers/error"
import { FilterQuery } from "mongoose"
import { Question, Tag } from "@/database"
import { convertToPlainObject } from "../utils"
import { GetTagQuestionsParams } from "@/types/action"
import { NotFoundError } from "../http-error"

export const getTags = async (
    params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: TagType[], isNext: boolean }>> => {
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

export const getTagQuestions = async (
    params: GetTagQuestionsParams
): Promise<ActionResponse<{ tag: TagType, question: QuestionType[], isNext: boolean }>> => {
    const validationResult = await action({ params, schema: GetTagQuestionsSchema, authorize: true })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { tagId, page = 1, pageSize = 10, query } = validationResult.params!
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    try {
        const tag = await Tag.findById(tagId)
        if (!tag) throw new NotFoundError('Tag')

        const filterQuery: FilterQuery<typeof Question> = {
            tags: { $in: [tagId] }
        }

        if (query) {
            filterQuery.title = { $regex: query, $options: 'i' }
        }

        const totalQuestions = await Question.countDocuments(filterQuery)

        const questions = await Question.find(filterQuery)
            .select('_id title views answers upvotes downvotes author createAt')
            .populate([
                { path: 'author', select: 'name image' },
                { path: 'tags', select: 'name' }
            ])
            .skip(skip)
            .limit(limit)

        const isNext =totalQuestions > skip + questions.length

        return {
            success: true,
            data: {
                tag: convertToPlainObject(tag),
                question: convertToPlainObject(questions),
                isNext
            }
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}