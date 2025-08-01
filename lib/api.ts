import ROUTES from "@/constants/routes";
import { IAccount } from "@/database/account.model";
import { IUser } from "@/database/user.model";
import { SignInWithOAuthParams } from "@/types/action";
import { ActionResponse } from "@/types/global";
import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

interface Job {
    query: string,
    page?: number | string,
    num_pages?: number | string,
    country: string,
    date_posted?: string
}

export const api = {
    auth: {
        oAuthSignIn: ({ user, provider, providerAccountId }: SignInWithOAuthParams) => fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGNIN_WITH_OAUTH}`, {
            method: "POST",
            body: JSON.stringify({ user, provider, providerAccountId })
        })
    },
    users: {
        getAll: () => fetchHandler(`${API_BASE_URL}/users`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
        getByEmail: (email: string) => fetchHandler(`${API_BASE_URL}/users/email`, {
            method: "POST",
            body: JSON.stringify({ email })
        }),
        create: (userData: Partial<IUser>) => fetchHandler(`${API_BASE_URL}/users`, {
            method: "POST",
            body: JSON.stringify(userData)
        }),
        update: (id: string, userData: Partial<IUser>) => fetchHandler(`${API_BASE_URL}/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(userData)
        }),
        delete: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`, {
            method: "DELETE"
        }),
        getUserLocation: () => fetchHandler('http://ip-api.com/json')
    },
    accounts: {
        getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
        getByProvider: (providerAccountId: string) => fetchHandler(`${API_BASE_URL}/accounts/provider`, {
            method: "POST",
            body: JSON.stringify({ providerAccountId })
        }),
        create: (accountData: Partial<IAccount>) => fetchHandler(`${API_BASE_URL}/accounts`, {
            method: "POST",
            body: JSON.stringify(accountData)
        }),
        update: (id: string, accountData: Partial<IAccount>) => fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
            method: "PUT",
            body: JSON.stringify(accountData)
        }),
        delete: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
            method: "DELETE"
        })
    },
    ai: {
        getAnswers: (question: string, content: string, userAnswer?: string): Promise<ActionResponse<string>> =>
            fetchHandler(`${API_BASE_URL}/ai/answers`, {
                method: "POST",
                body: JSON.stringify({ question, content, userAnswer })
            })
    },
    countries: {
        // getAllCountires: () => fetchHandler('https://restcountries.com/v2/all?fields=name,flag')
        getAllCountires: () => fetchHandler('https://countriesnow.space/api/v0.1/countries/flag/images')
    },
    jobs: {
        searchJob: ({ query, country }: Job) => fetchHandler(`https://jsearch.p.rapidapi.com/search?query=${query}&country=${country}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '20f2ffe31fmshc8de71f035c3f8dp12ee16jsnee5cff02a94d',
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
        })
    }
}