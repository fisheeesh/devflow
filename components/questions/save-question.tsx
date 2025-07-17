"use client"

import { toggleSaveQuestion } from "@/lib/actions/collection.actions"
import { ActionResponse } from "@/types/global"
import Image from "next/image"
import { use, useTransition } from "react"
import { toast } from "sonner"

interface Props {
    questionId: string
    hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>
}

export default function SaveQuestion({ questionId, hasSavedQuestionPromise }: Props) {
    const { data } = use(hasSavedQuestionPromise)

    const [isPending, startTransition] = useTransition()

    const { saved: hasSaved } = data || {}

    const handleSave = () => {
        startTransition(async () => {
            const { success, data, error } = await toggleSaveQuestion({ questionId })

            if (!success) {
                toast.error('Error', {
                    description: error?.message || 'Something went wrong'
                })
                return
            }

            if (data?.saved) {
                toast.success('Success', {
                    description: 'Question unsaved successfully'
                })
            } else {
                toast.success('Success', {
                    description: 'Question saved successfully'
                })
            }
        })
    }

    return (
        <Image
            src={hasSaved ? '/icons/star-filled.svg' : '/icons/star-red.svg'}
            width={18}
            height={18}
            alt="save"
            className={`cursor-pointer ${isPending && 'opacity-50'}`}
            aria-label="Save-question"
            onClick={handleSave}
        />
    )
}
