import { ActionResponse } from "@/types/global";
import logger from "../logger";
import handleError from "./error";
import { RequestError } from "../http-error";

/**
 * * As we fetch in our comp, we have to write all the different headers, opitons and config and handle errors
 * * That might seem to be boring and bolierpate code
 * * So to overcome that, we create a centralized reusable fetch function
 */

interface FetchOptions extends RequestInit {
    timeout?: number
}

function isError(error: unknown): error is Error {
    return error instanceof Error
}

export async function fetchHanlder<T>(url: string, options: FetchOptions = {}): Promise<ActionResponse<T>> {
    const {
        timeout = 5000,
        headers: customHeaders = {},
        ...restOptions
    } = options

    //* We're gonna prevent our request from taking too long
    const controller = new AbortController()

    const id = setTimeout(() => controller.abort(), timeout)

    const defaultHeaders: HeadersInit = {
        "Content-Type": "applicaiton/json",
        Accept: "applicaiton/json",
    }

    const headers: HeadersInit = { ...defaultHeaders, ...customHeaders }

    const config: RequestInit = {
        ...restOptions,
        headers,
        //* signal to support request cancellation
        signal: controller.signal
    }

    try {
        const response = await fetch(url, config)

        clearTimeout(id)

        if (!response.ok) {
            throw new RequestError(response.status, `HTTP error: ${response.status}`)
        }

        return await response.json()
    } catch (err) {
        const error = isError(err) ? err : new Error('Unknown Error')

        if (error.name === 'AbortError') {
            logger.warn(`Request to ${url} timed out.`)
        }
        else {
            logger.error(`Error fetching ${url}: ${error.message}`)
        }

        return handleError(error) as ActionResponse<T>
    }
}