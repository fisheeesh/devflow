"use client"

import { AskQuestionSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useRef, useTransition } from 'react'
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ROUTES from '@/constants/routes'
import { createQuestion, editQuestion } from '@/lib/actions/question.actions'
import { MDXEditorMethods } from '@mdxeditor/editor'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import TagCard from '../cards/tag-card'
import { Question } from '@/types/global'
import Spinner from '../spinner'

//* This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import('@/components/editor'), {
    //! Make sure we turn SSR off
    ssr: false
})

interface Params {
    question?: Question,
    isEdit?: boolean
}

export default function QuestionForm({ question, isEdit = false }: Params) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const editorRef = useRef<MDXEditorMethods>(null)

    const form = useForm<z.infer<typeof AskQuestionSchema>>({
        defaultValues: {
            title: question?.title || "",
            content: question?.content || "",
            tags: question?.tags.map(tag => tag.name) || []
        },
        resolver: zodResolver(AskQuestionSchema)
    })
    const isWorking = isPending || form.formState.isSubmitting

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
        if (e.key === 'Enter') {
            e.preventDefault()

            const tagInput = e.currentTarget.value.trim()

            if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
                form.setValue("tags", [...field.value, tagInput])
                e.currentTarget.value = ''
                form.clearErrors('tags')
            } else if (tagInput.length > 15) {
                form.setError('tags', {
                    type: 'manual',
                    message: 'Tag should be less than 15 characters',
                })
            } else if (field.value.includes(tagInput)) {
                form.setError('tags', {
                    type: 'manual',
                    message: 'Tag already exists',
                })
                e.currentTarget.value = ''
            }
        }
    }

    const handleTagRemove = (tag: string, field: { value: string[] }) => {
        const newTags = field.value.filter(t => t !== tag)

        form.setValue("tags", newTags)

        if (newTags.length === 0) {
            form.setError('tags', {
                type: 'manual',
                message: 'At least one tag is required',
            })
        }
    }

    const handleOnSubmit: SubmitHandler<z.infer<typeof AskQuestionSchema>> = (data) => {
        startTransition(async () => {
            if (isEdit && question) {
                const res = await editQuestion({ questionId: question._id, ...data })

                if (res.success) {
                    toast.success('Success', {
                        description: 'Question updated successfully'
                    })

                    if (res.data) router.push(ROUTES.QUESTION(String(res.data._id)))

                } else {
                    toast.error(`Error ${res.status}`, {
                        description: res.error?.message || 'Something went wrong'
                    })
                }

                return
            }

            const res = await createQuestion(data)

            if (res.success) {
                toast.success('Success', {
                    description: 'Question created successfully'
                })

                if (res.data) router.push(ROUTES.QUESTION(res.data._id))

            } else {
                toast.error(`Error ${res.status}`, {
                    description: res.error?.message || 'Something went wrong'
                })
            }
        })
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex w-full flex-col gap-10">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof AskQuestionSchema>, "title"> }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel className="paragraph-medium text-dark400_light700">Question Title <span className='text-primary-500'>*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isWorking}
                                        type='text'
                                        placeholder="Title"
                                        className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className='body-regular text-light-500 mt-2.5'>
                                    Be specific and imagine you&apos;re askint a question to another
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof AskQuestionSchema>, "content"> }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel className="paragraph-medium text-dark400_light700">Detailed explanation of your problem{" "} <span className='text-primary-500'>*</span></FormLabel>
                                <FormControl>
                                    <Editor
                                        value={field.value}
                                        editorRef={editorRef}
                                        fieldChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription className='body-regular text-light-500 mt-2.5'>
                                    Introduce the problem and exapnd on what you&apos;ve put in the title.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof AskQuestionSchema>, "tags"> }) => (
                            <FormItem className="flex flex-col w-full gap-3">
                                <FormLabel className="paragraph-medium text-dark400_light700">Tags <span className='text-primary-500'>*</span></FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            disabled={isWorking}
                                            type='text'
                                            placeholder="Add Tags..."
                                            className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                            onKeyDown={(e) => handleInputKeyDown(e, field)}
                                        // {...field}
                                        />
                                        {field.value.length > 0 && (
                                            <div className='flex-start mt-2.5 flex-wrap gap-2.5'>
                                                {field?.value?.map((tag: string) =>
                                                    <TagCard
                                                        key={tag}
                                                        _id={tag}
                                                        name={tag}
                                                        compact
                                                        remove
                                                        isButton
                                                        handleRemove={() => handleTagRemove(tag, field)}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormDescription className='body-regular text-light-500 mt-2.5'>
                                    Add up to 3 tags to describe what you quesiton is about.You need to press enter to add a tag.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='mt-16 flex justify-end'>
                        <Button disabled={isWorking} type='submit' className='primary-gradient text-light-900 w-fit'>
                            <Spinner label='Submitting...' isLoading={isWorking}>
                                {isEdit ? 'Edit' : 'Ask A Question'}
                                <span className="sr-only">{isEdit ? 'Edit' : 'Ask A Question'}</span>
                            </Spinner>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
