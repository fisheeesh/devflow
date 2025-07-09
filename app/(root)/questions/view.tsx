'use client'

import { incrementViews } from "@/lib/actions/question.actions"
import { useEffect } from "react"
import { toast } from "sonner"

/**
 * * - **Initial Page Load:** When a user visits the question details page, 
 * * the server renders the page with the current view count. This is because the page
 * * is a server component, so it's getting executed right on the server.
 * * - **View Count Increent:** After teh page is loaded, a server action is called
 * * to increment the view count in the database. This server action is called from
 * * the client side, meaning only after the page has been rendered, DOM has been created, 
 * * and a client call is made through `useEffect`.
 * * - **Stale Data Issue:** The problem arises because the page was rendered and served
 * * to the client before the view count was incremented. This means the user doesn't see
 * * the updated view count immediately.
 * * - **Delayed Update:** Thus, the user would only see the updted view count if they navigate away
 * * and then return to the page or if they refresh the page.
 */

export default function View({ questionId }: { questionId: string }) {
    const handleIncrement = async () => {
        const res = await incrementViews({ questionId })

        if (res.success) {
            toast.success('Success', {
                description: 'Views incremented successfully'
            })
        } else {
            toast.error(`Error ${res.status}`, {
                description: res?.error?.message
            })
        }
    }

    useEffect(() => {
        handleIncrement()
    }, [])

    return null
}
