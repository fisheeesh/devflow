import { IUser } from "@/database/user.model";
import { fetchHanlder } from "./handlers/fetch";
import { IAccount } from "@/database/account.model";

const API_BASE_URL = process.env.NEXT_PUBLC_API_BASE_URL || 'http://localhost:3000/api'

export const api = {
    users: {
        getAll: () => fetchHanlder(`${API_BASE_URL}/users`),
        getById: (id: string) => fetchHanlder(`${API_BASE_URL}/users/${id}`),
        getByEmail: (email: string) => fetchHanlder(`${API_BASE_URL}/users/email`, {
            method: "POST",
            body: JSON.stringify({ email })
        }),
        create: (userData: Partial<IUser>) => fetchHanlder(`${API_BASE_URL}/users`, {
            method: "POST",
            body: JSON.stringify(userData)
        }),
        update: (id: string, userData: Partial<IUser>) => fetchHanlder(`${API_BASE_URL}/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(userData)
        }),
        delete: (id: string) => fetchHanlder(`${API_BASE_URL}/users/${id}`, {
            method: "DELETE"
        })
    },
    accounts: {
        getAll: () => fetchHanlder(`${API_BASE_URL}/accounts`),
        getById: (id: string) => fetchHanlder(`${API_BASE_URL}/accounts/${id}`),
        getByProvider: (providerAccountId: string) => fetchHanlder(`${API_BASE_URL}/accounts/provider`, {
            method: "POST",
            body: JSON.stringify({ providerAccountId })
        }),
        create: (accountData: Partial<IAccount>) => fetchHanlder(`${API_BASE_URL}/accounts`, {
            method: "POST",
            body: JSON.stringify(accountData)
        }),
        update: (id: string, accountData: Partial<IAccount>) => fetchHanlder(`${API_BASE_URL}/accounts/${id}`, {
            method: "PUT",
            body: JSON.stringify(accountData)
        }),
        delete: (id: string) => fetchHanlder(`${API_BASE_URL}/accounts/${id}`, {
            method: "DELETE"
        })
    }
}