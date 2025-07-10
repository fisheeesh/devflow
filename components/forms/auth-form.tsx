"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, Path, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ROUTES from "@/constants/routes"
import { ActionResponse } from "@/types/global"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Spinner from "../spinner"

interface AuthFormProps<T extends z.ZodType<any, any, any>> {
    schema: T,
    defaultValues: z.infer<T>,
    formType: "SIGN_UP" | "SIGN_IN",
    onSubmit: (data: z.infer<T>) => Promise<ActionResponse>
}

const AuthForm = <T extends z.ZodType<any, any, any>>({
    schema,
    defaultValues,
    formType,
    onSubmit
}: AuthFormProps<T>) => {
    const router = useRouter()
    type FormData = z.infer<T>

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<FormData>
    })

    const handleSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        //@TODO: Authenticate user
        const res = (await onSubmit(data)) as ActionResponse

        if (res?.success) {
            toast.success('Success', {
                description: formType === 'SIGN_IN'
                    ? 'Signed in successfully'
                    : 'Signed up successfully'
            })

            router.push(ROUTES.HOME)
        }
        else {
            toast.error(`Error ${res.status}`, {
                description: res?.error?.message
            })
        }
    }

    const buttonText = formType === "SIGN_UP" ? "Sign Up" : "Sign In"

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-10">
                {
                    Object.keys(defaultValues).map(field => (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as Path<FormData>}
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full gap-2.5">
                                    <FormLabel className="paragraph-medium text-dark400_light700">
                                        {field.name === 'email' ? 'Email Address' :
                                            field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                                        <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type={field.name === 'password' ? 'password' : 'text'}
                                            className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))
                }

                <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                    className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 cursor-pointer px-4 py-3 font-inter !text-light-900"
                >
                    <Spinner isLoading={form.formState.isSubmitting} label={buttonText === 'Sign In' ? 'Signing In' : 'Signing Up'}>{buttonText}</Spinner>
                </Button>
                {
                    formType === 'SIGN_IN' ? (
                        <p>
                            Don&apos;t have an account?{" "}
                            <Link className="paragraph-semibold primary-text-gradient" href={ROUTES.SIGN_UP}>
                                Sign Up
                            </Link>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <Link className="paragraph-semibold primary-text-gradient" href={ROUTES.SIGN_IN}>
                                Sign In
                            </Link>
                        </p>
                    )
                }
            </form>
        </Form>
    )
}

export default AuthForm