"use client"

import AuthForm from '@/components/forms/AuthForm'
import { SignInSchema, SignUpSchema } from '@/lib/validation'
import React from 'react'

export default function SingUpPage() {
    return (
        <div>
            <AuthForm
                formType="SIGN_UP"
                schema={SignUpSchema}
                defaultValues={{ email: '', password: '', name: '', username: '' }}
                onSubmit={(data) => Promise.resolve({ success: true, data })}
            />
        </div>
    )
}
