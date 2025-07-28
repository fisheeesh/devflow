import { NextResponse } from "next/server";

interface Tag {
    _id: string;
    name: string;
    questions?: number;
}

interface Author {
    _id: string;
    name: string;
    image: string
}

interface Question {
    _id: string;
    title: string;
    content: string;
    tags: Tag[];
    author: Author;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    answers: number;
    views: number;
}

type ActionResponse<T = null> = {
    success: boolean,
    data?: T,
    error?: {
        message: string,
        details?: Record<string, string[]>,
    },
    status?: number
}

type SuccessResponse<T = null> = ActionResponse<T> & { success: true }

type ErrorResponse = ActionResponse<undefined> & { success: false }

type APIErrorResponse = NextResponse<ErrorResponse>

type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>

interface RouteParams {
    params: Promise<Record<string, string>>,
    searchParams: Promise<Record<string, string>>
}

interface PaginatedSearchParams {
    page?: number,
    pageSize?: number,
    query?: string,
    filter?: string,
    sort?: string
}

interface Answer {
    _id: string,
    author: Author,
    content: string,
    createdAt: Date,
    upvotes: number,
    downvotes: number,
    question: string
}

interface User {
    _id: string,
    name: string,
    username: string,
    email: string,
    bio?: string,
    image?: string,
    portfolio?: string,
    location?: string,
    reputation?: number,
    createdAt: Date
}

interface Collection {
    _id: string,
    author: string | Author,
    question: Question
}

interface Badges {
    GOLD: number;
    SILVER: number;
    BRONZE: number;
}

interface Job {
    id?: string;
    job_id?: string;
    employer_name?: string;
    employer_logo?: string | undefined;
    employer_website?: string;
    job_employment_type?: string;
    job_title?: string;
    job_description?: string;
    job_apply_link?: string;
    job_city?: string;
    job_state?: string;
    job_country?: string;
    job_max_salary?: string;
    job_min_salary?: string
}

interface Country {
    name: string;
    flag: string;
    iso2: string
    iso3: string;
}

interface UserLocation {
    country: string;
    countryCode: string;
    city: string
}

interface GlobalSearchedItem {
    id: string;
    type: "question" | "answer" | "user" | "tag";
    title: string;
}