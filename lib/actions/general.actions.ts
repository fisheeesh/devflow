'use server'

import { Answer, Question, Tag, User } from "@/database";
import { GlobalSearchParams } from "@/types/action";
import { ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GlobalSearchSchema } from "../validations";
import { convertToPlainObject } from "../utils";

export async function globalSearch(params: GlobalSearchParams) {
    try {
        const validationResult = await action({ params, schema: GlobalSearchSchema })
        if (validationResult instanceof Error) {
            return handleError(validationResult) as ErrorResponse
        }

        const { query, type } = validationResult.params!
        const regexQuery = { $regex: query, $options: 'i' }

        const results = []
        const modelsAndTypes = [
            { model: Question, searchField: "title", type: "question" },
            { model: User, searchField: "name", type: "user" },
            { model: Answer, searchField: "content", type: "answer" },
            { model: Tag, searchField: "name", type: "tag" },
        ];

        const typeLower = type?.toLowerCase()
        const SearchableTypes = ['question', 'answer', 'user', 'tag']
        if (!typeLower || !SearchableTypes.includes(typeLower)) {
            //* If no type is specified, search in all models
            for (const { model, searchField, type } of modelsAndTypes) {
                const queryResults = await model.find({
                    [searchField]: regexQuery
                }).limit(2)

                results.push(
                    ...queryResults.map(item => ({
                        title: type === 'answer' ? `Answer containing "${query}"` : item[searchField],
                        type,
                        id: type === 'answer' ? item.question : item._id
                    }))
                )
            }
        } else {
            //* Search in the specified model type
            const modelInfo = modelsAndTypes.find(item => item.type === typeLower)
            if (!modelInfo) throw new Error("Invalid search type")

            const queryResults = await modelInfo.model.find({
                [modelInfo.searchField]: regexQuery
            }).limit(8)

            results.push(
                ...queryResults.map(item => ({
                    title: type === 'answer' ? `Answer containing "${query}"` : item[modelInfo.searchField],
                    type,
                    id: type === 'answer' ? item.question : item._id
                }))
            )
        }

        return {
            success: true,
            data: convertToPlainObject(results)
        }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}