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
import { useRef, useState } from "react"
import { AnswerScheama } from "@/lib/validations"
import dynamic from "next/dynamic"
import { MDXEditorMethods } from "@mdxeditor/editor"
import Image from "next/image"

const Editor = dynamic(() => import('@/components/editor'), {
    //! Make sure we turn SSR off
    ssr: false
})

const AnswerForm = () => {
    const [isAISubmitting, setIsAISubmitting] = useState(false)
    const editorRef = useRef<MDXEditorMethods>(null)

    const form = useForm<z.infer<typeof AnswerScheama>>({
        resolver: zodResolver(AnswerScheama),
        defaultValues: { content: '' }
    })

    const onSubmit: SubmitHandler<z.infer<typeof AnswerScheama>> = async (data) => {
        //@TODO: submit answer
        console.log(data)
    }

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark400_light800">Wirte your answer here</h4>
                <Button
                    className="btn light-border-2 gap-1.5 rounded-md border px-4 py-3 text-primary-500 shadow-none dark:text-primary-500"
                    disabled={isAISubmitting}>
                    {
                        isAISubmitting ?
                            (
                                <Spinner label="Generating" />
                            ) :
                            <>
                                <Image
                                    src={'/icons/stars.svg'}
                                    alt='Generate AI answer'
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                />
                                Generate AI Answer
                            </>
                    }
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
                        <Button disabled={form.formState.isSubmitting} type="submit" className="primary-gradient w-fit text-white">
                            {
                                form.formState.isSubmitting ? (
                                    <Spinner label="Posting" />
                                ) : "Post Answer"
                            }
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AnswerForm