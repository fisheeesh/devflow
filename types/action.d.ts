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