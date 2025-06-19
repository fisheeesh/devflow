"use client"

import { AskQuestionSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useRef } from 'react'
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
import { MDXEditorMethods } from '@mdxeditor/editor'
import dynamic from 'next/dynamic'
import TagCard from '../cards/tag-card'

//* This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import('@/components/editor'), {
    //! Make sure we turn SSR off
    ssr: false
})

export default function QuestionForm() {
    const editorRef = useRef<MDXEditorMethods>(null)
    const form = useForm<z.infer<typeof AskQuestionSchema>>({
        defaultValues: {
            title: "",
            content: "",
            tags: []
        },
        resolver: zodResolver(AskQuestionSchema)
    })

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

    const handleCreateQuestion: SubmitHandler<z.infer<typeof AskQuestionSchema>> = (data) => {
        console.log(data)
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateQuestion)} className="flex w-full flex-col gap-10">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof AskQuestionSchema>, "title"> }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel className="paragraph-medium text-dark400_light700">Question Title <span className='text-primary-500'>*</span></FormLabel>
                                <FormControl>
                                    <Input
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
                        <Button type='submit' className='primary-gradient text-light-900 w-fit'>
                            Ask A Question
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
