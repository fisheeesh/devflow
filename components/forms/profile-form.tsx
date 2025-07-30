"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
import { User } from "@/types/global";
import { EditProfileFormSchema } from "@/lib/validations";
import z from "zod";
import { useTransition } from "react";

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Spinner from "../spinner";
import { editProfile } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

interface Props {
    user: User
}

export default function ProfileForm({ user }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof EditProfileFormSchema>>({
        resolver: zodResolver(EditProfileFormSchema),
        defaultValues: {
            name: user.name || "",
            username: user.username || "",
            portfolio: user.portfolio || "",
            location: user.location || "",
            bio: user.bio || ""
        }
    })

    const handleSubmitProfile: SubmitHandler<z.infer<typeof EditProfileFormSchema>> = (data) => {
        startTransition(async () => {
            const res = await editProfile(data)

            if (!res.success) {
                toast.error('Error', {
                    description: res.error?.message
                })

                return
            }

            toast.success('Success', {
                description: 'Profile updated successfully'
            })

            if (res.data) router.push(ROUTES.PROFILE(user._id))
        })
    }

    const isWorking = isPending || form.formState.isSubmitting

    return (
        <div className="mt-10">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitProfile)} className="flex w-full flex-col gap-10">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof EditProfileFormSchema>, "name"> }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel className="paragraph-medium text-dark400_light700">Name <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                        placeholder="Your name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof EditProfileFormSchema>, "username"> }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel className="paragraph-medium text-dark400_light700">Username <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                        placeholder="Your username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="portfolio"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof EditProfileFormSchema>, "portfolio"> }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel className="paragraph-medium text-dark400_light700">Portfolio Link</FormLabel>
                                <FormControl>
                                    <Input
                                        className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                        placeholder="Your portfolio link"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof EditProfileFormSchema>, "location"> }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel className="paragraph-medium text-dark400_light700">Location <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                        placeholder="Where do you live?"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof EditProfileFormSchema>, "bio"> }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel className="paragraph-medium text-dark400_light700">Bio <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="resize-none paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[120px] no-focus border"
                                        placeholder="What's special about you?"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-end'>
                        <Button
                            type="submit"
                            disabled={isWorking}
                            className='primary-gradient text-light-900 w-fit'
                        >
                            <Spinner label="Submitting..." isLoading={isWorking}>
                                Submit
                            </Spinner>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
