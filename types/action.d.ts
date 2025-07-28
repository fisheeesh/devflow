import mongoose from "mongoose"
import { PaginatedSearchParams } from "./global"

interface SignInWithOAuthParams {
    provider: 'google' | 'github',
    providerAccountId: string,
    user: {
        name: string,
        username: string,
        email: string,
        image: string
    }
}

interface AuthCredentials {
    name: string,
    username: string,
    email: string,
    password: string
}

interface CreateQuestionParams {
    title: string,
    content: string,
    tags: string[]
}

interface EditQuestionParams extends CreateQuestionParams {
    questionId: string
}

interface GetQuestionParams {
    questionId: string
}

interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, 'filter'> {
    tagId: string
}

interface IncrementViewsParams {
    questionId: string
}

interface CreateAnswerParams {
    questionId: string,
    content: string
}

interface GetAnswersParams extends PaginatedSearchParams {
    questionId: string
}

interface CreateVoteParams {
    targetId: string,
    targetType: 'question' | 'answer',
    voteType: 'upvote' | 'downvote',
}

interface UpdateVoteCountParams extends CreateVoteParams {
    change: 1 | -1
}

type HasVotedParams = Pick<CreateAnswerParams, 'targetId' | 'targetType'>

interface HasVotedResponse {
    hasUpvoted: boolean;
    hasDownvoted: boolean
}

interface CollectionBaseParams {
    questionId: string
}

interface GetUserParams {
    userId: string
}

interface GetUserQuestionsParams extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
    userId: string
}

interface GetUserAnswersParams extends PaginatedSearchParams {
    userId: string
}

interface GetUserTagsParams {
    userId: string
}

interface DeleteQuestionParams {
    questionId: string
}

interface DeleteAnswerParams {
    answerId: string
}

interface CreateInteractionParams {
    action:
    | "view"
    | "upvote"
    | "downvote"
    | "bookmark"
    | "post"
    | "edit"
    | "delete"
    | "search";
    actionTarget: "question" | "answer"
    actionId: string
    authorId: string
}

interface UpdateReputationParams {
    interaction: IInteractionDoc;
    session: mongoose.ClientSession;
    performerId: string;
    authorId: string;
}

interface GetUserParams {
    userId: string
}

interface RecommendationParams {
    userId: string;
    query?: string;
    skip: number;
    limit: number;
}

interface JobFilterParams {
    query: string,
    page: string | number,
    location: string
}