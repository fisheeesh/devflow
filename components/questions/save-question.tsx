"use client"

import { toggleSaveQuestion } from "@/lib/actions/collection.actions"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useId, useTransition } from "react"
import { toast } from "sonner"

export default function SaveQuestion({ questionId }: { questionId: string }) {
    const session = useSession()
    const userId = session?.data?.user?.id
    const [isPending, startTransition] = useTransition()

    const handleSave = () => {
        if (!userId) return toast.error('Error', {
            description: "You need to be logged in to save a question."
        })

        startTransition(async () => {
            const { success, data, error } = await toggleSaveQuestion({ questionId })

            if (!success) throw new Error(error?.message || 'Something went wrong')

            if (data?.saved) {
                toast.success('Success', {
                    description: 'Question saved successfully'
                })
            } else {
                toast.success('Success', {
                    description: 'Question unsaved successfully'
                })
            }
        })
    }

    return (
        <Image
            src='/icons/star-filled.svg'
            width={18}
            height={18}
            alt="save"
            className={`cursor-pointer ${isPending && 'opacity-50'}`}
            aria-label="Save-question"
            onClick={handleSave}
        />
    )
}
