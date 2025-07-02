"use client"

import AuthForm from '@/components/forms/AuthForm'
import { signInWithCredentials } from '@/lib/actions/auth.actions'
import { SignInSchema } from '@/lib/validations'

export default function SignInPage() {
    return (
        <div>
            <AuthForm
                formType="SIGN_IN"
                schema={SignInSchema}
                defaultValues={{ email: '', password: '' }}
                onSubmit={signInWithCredentials}
            />
        </div>
    )
}
