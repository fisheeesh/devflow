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

interface EditQuestionParms extends CreateQuestionParams {
    questionId: string
}

interface GetQuestionParams {
    questionId: string
}