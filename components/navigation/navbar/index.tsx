import Image from 'next/image'
import Link from 'next/link'

import ThemeToggle from './theme-toggle'
import MobileNavigation from './mobile-navigation'
import { auth } from '@/auth'
import UserAvatar from '@/components/user-avatar'
import GlobalSearch from '@/components/search/global-search'

export default async function Navbar() {
    const session = await auth()

    return (
        <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5  p-6 shadow-light-300 dark:shadow-none sm:px-12">
            <Link href='/' className='flex items-center gap-1'>
                <Image src='/images/site-logo.svg' width={23} height={23} alt='Devflow Logo' />
                <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden'>
                    Dev<span className='text-primary-500'>Flow</span>
                </p>
            </Link>
            <GlobalSearch />
            <div className='flex-between gap-5'>
                <ThemeToggle />

                {session?.user?.id && (
                    <UserAvatar
                        id={session?.user?.id}
                        name={session?.user?.name ?? ''}
                        imageUrl={session?.user?.image}
                    />
                )}

                <MobileNavigation />
            </div>
        </nav>
    )
}
