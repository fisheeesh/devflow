"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import Spinner from "../spinner"
import { useRef, useState, useTransition } from "react"
import { AnswerScheama } from "@/lib/validations"
import dynamic from "next/dynamic"
import { MDXEditorMethods } from "@mdxeditor/editor"
import Image from "next/image"
import { createAnswer } from "@/lib/actions/answer.actions"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"

const Editor = dynamic(() => import('@/components/editor'), {
    //! Make sure we turn SSR off
    ssr: false
})

interface Props {
    questionId: string
    questionTitle: string
    questionContent: string
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
    const [isPending, startTransaction] = useTransition()
    const [isAISubmitting, setIsAISubmitting] = useState(false)
    const editorRef = useRef<MDXEditorMethods>(null)
    const session = useSession()

    const form = useForm<z.infer<typeof AnswerScheama>>({
        resolver: zodResolver(AnswerScheama),
        defaultValues: { content: '' }
    })

    const isWorking = isPending || form.formState.isSubmitting

    const onSubmit: SubmitHandler<z.infer<typeof AnswerScheama>> = (data) => {
        //@TODO: submit answer
        startTransaction(async () => {
            const res = await createAnswer({ questionId, ...data })

            if (res.success) {
                form.reset()

                toast.success('Success', {
                    description: "Your answer has been posted successfully.",
                })

                if (editorRef.current) {
                    editorRef.current.setMarkdown('')
                }

            } else {
                toast.error(`Error ${res.status}`, {
                    description: res?.error?.message
                })
            }
        })
    }

    const genereateAIAnswer = async () => {
        if (session.status !== 'authenticated') {
            return toast.error('Error', {
                description: 'You must be logged in to generate an AI answer'
            })
        }

        setIsAISubmitting(true)

        try {
            const response = await api.ai.getAnswers(questionTitle, questionContent)
            console.log('Full API Response:', response) // Debug log

            const { success, data, error } = response
            if (!success) {
                console.error('API Error:', error) // Debug log
                return toast.error('Error', {
                    description: error?.message
                })
            }

            console.log('Raw data:', data) // Debug log
            console.log('Data type:', typeof data) // Debug log

            // Handle the response properly
            const formattedAnswer = typeof data === 'string' ? data.trim() : String(data || '').trim()

            console.log('Formatted answer:', formattedAnswer) // Debug log
            console.log('Editor ref current:', editorRef.current) // Debug log

            if (formattedAnswer) {
                // Set form value - this should automatically update the editor via the value prop
                form.setValue('content', formattedAnswer)

                // Force form to recognize the change
                form.trigger('content')

                // Also manually trigger the field change callback to ensure editor updates
                const contentField = form.getFieldState('content')
                if (contentField) {
                    // This should trigger the editor to update
                    console.log('Triggering field change manually')
                }

                console.log('Form content value after setting:', form.getValues('content')) // Debug log

                // Optional: Still try to set via ref as backup, but don't rely on it
                if (editorRef.current) {
                    console.log('Editor ref available, setting as backup')
                    editorRef.current.setMarkdown(formattedAnswer)
                }
            } else {
                console.warn('No formatted answer to set') // Debug log
                toast.error('Error', {
                    description: 'AI generated an empty response'
                })
                return
            }

            toast.success('Success', {
                description: "AI answer has been generated successfully",
            })

        } catch (error) {
            console.error('AI Answer Generation Error:', error) // Add logging for debugging
            toast.error('Error', {
                description: (error instanceof Error) ? error.message : 'There was a problem with your request'
            })
        }
        finally {
            setIsAISubmitting(false)
        }
    }

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
                <Button
                    onClick={genereateAIAnswer}
                    className="btn light-border-2 gap-1.5 rounded-md border px-4 py-3 text-primary-500 shadow-none dark:text-primary-500"
                    disabled={isAISubmitting}>
                    <Spinner isLoading={isAISubmitting} label="Generating...">
                        <Image
                            src={'/icons/stars.svg'}
                            alt='Generate AI answer'
                            width={20}
                            height={20}
                            className="object-contain"
                        />
                        Generate AI Answer
                    </Spinner>
                </Button>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-6 flex w-full flex-col gap-10"
                >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof AnswerScheama>, 'content'> }) => (
                            <FormItem className="flex w-full flex-col gap-3">
                                <FormControl>
                                    <Editor
                                        value={field.value}
                                        editorRef={editorRef}
                                        fieldChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button disabled={isWorking} type="submit" className="primary-gradient w-fit text-white">
                            <Spinner isLoading={isWorking} label="Posting...">Post Answer</Spinner>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AnswerForm