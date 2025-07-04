"use client"

import AuthForm from '@/components/forms/auth-form'
import { signUpWithCredentials } from '@/lib/actions/auth.actions'
import { SignUpSchema } from '@/lib/validations'
import React from 'react'

export default function SingUpPage() {
    return (
        <div>
            <AuthForm
                formType="SIGN_UP"
                schema={SignUpSchema}
                defaultValues={{ email: '', password: '', name: '', username: '' }}
                onSubmit={signUpWithCredentials}
            />
        </div>
    )
}
