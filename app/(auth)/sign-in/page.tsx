"use client"

import AuthForm from '@/components/forms/AuthForm'
import { SignInSchema } from '@/lib/validation'

export default function SignInPage() {
    return (
        <div>
            <AuthForm
                formType="SIGN_IN"
                schema={SignInSchema}
                defaultValues={{ email: '', password: '' }}
                onSubmit={(data) => Promise.resolve({ success: true, data })}
            />
        </div>
    )
}
