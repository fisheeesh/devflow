import { auth } from '@/auth'
import SocialAuthForm from '@/components/forms/social-auth-form'
import ROUTES from '@/constants/routes'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function AuthLayout({ children }: { children: ReactNode }) {
    const session = await auth()

    if(session) return redirect(ROUTES.HOME)

    return (
        <main className='flex min-h-screen justify-center items-center bg-auth-light dark:bg-auth-dark bg-cover bg-center bg-no-repeat px-4 pt-10'>
            <section className='light-border background-light800_dark200 shadow-light100_dark100 min-w-full rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8'>
                <div className="flex items-center justify-between gap-2">
                    <div className='space-y-2.5'>
                        <h1 className='h2-bold text-dark100_light900'>Join DevFlow</h1>
                        <p className="paragraph-regulat text-dark500_light400">To get your questions answered</p>
                    </div>
                    <Link href='/'>
                        <Image src='/images/site-logo.svg' alt='DevFlow Logo' width={50} height={50} className='object-contain' />
                    </Link>
                </div>
                {children}
                <SocialAuthForm />
            </section>
        </main>
    )
}
