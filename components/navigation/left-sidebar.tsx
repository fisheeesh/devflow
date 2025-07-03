import React from 'react'
import NavLinks from './navbar/nav-links'
import ROUTES from '@/constants/routes'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { auth, signOut } from '@/auth'
import { LogOut } from 'lucide-react'

export default async function LeftSideBar() {
    const session = await auth()
    const userId = session?.user?.id

    return (
        <section className='no-scrollbar background-light900_dark200 gap-12 light-border flex flex-col justify-between border-r p-6 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px] h-full overflow-y-auto'>
            <div className="flex flex-col flex-1 gap-4">
                <NavLinks userId={userId} />
            </div>

            <div className='flex flex-col gap-3'>
                {userId ? (
                    <form action={async () => {
                        "use server"
                        await signOut()
                    }}>
                        <Button
                            type='submit'
                            className="small-medium cursor-pointer btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                        >
                            <LogOut className='size-5 text-black dark:text-white' />
                            <span className='max-lg:hidden text-dark300_light900'>Logout</span>
                        </Button>
                    </form>
                ) : (
                    <>
                        <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none" asChild>
                            <Link href={ROUTES.SIGN_IN}>
                                <Image src={'/icons/account.svg'} alt='Account' width={20} height={20} className='invert-colors lg:hidden' />
                                <span className="primary-text-gradient max-lg:hidden">Log In</span>
                            </Link>
                        </Button>

                        <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none" asChild>
                            <Link href={ROUTES.SIGN_UP}>
                                <Image src={'/icons/sign-up.svg'} alt='Account' width={20} height={20} className='invert-colors lg:hidden' />
                                <span className='max-lg:hidden'>Sign Up</span>
                            </Link>
                        </Button>
                    </>
                )
                }
            </div >
        </section >
    )
}