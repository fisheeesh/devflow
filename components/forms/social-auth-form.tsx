"use client"

import { Button } from '../ui/button'
import Image from 'next/image'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import ROUTES from '@/constants/routes'

export default function SocialAuthForm() {
    const btnClass = 'background-dark400_light900 body-medium text-dark200_light800 cursor-pointer min-h-12 flex-1 rounded-2 px-4 py-3.5'

    const handleSignIn = async (provider: "github" | "google") => {
        try {
            await signIn(provider, {
                redirectTo: ROUTES.HOME,
                redirect: true
            })
        } catch (error) {
            console.log(error)

            toast.error('Sign-in failed', {
                description: error instanceof Error ? error.message : 'An erorr occured during sign-in'
            })
        }
    }

    return (
        <div className='mt-10 flex flex-wrap gap-2.5'>
            <Button className={btnClass} onClick={() => handleSignIn('github')}>
                <Image src='/icons/github.svg' alt='Github Logo' width={20} height={20} className='invert-colors mr-2.5 object-contain' />
                <span>Log in with Github</span>
            </Button>
            <Button className={btnClass} onClick={() => handleSignIn('google')}>
                <Image src='/icons/google.svg' alt='Google Logo' width={20} height={20} className='mr-2.5 object-contain' />
                <span>Log in with Google</span>
            </Button>
        </div>
    )
}
