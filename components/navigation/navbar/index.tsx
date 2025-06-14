import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Navbar() {
    return (
        <nav className='flex-between bg-light-900_dark200 fixed z-50 w-full p-6 dark:shadow-none sm:px-12 shadow-light-300 gap-5'>
            <Link href='/' className='flex items-center gap-1'>
                <Image src='/images/site-logo.svg' width={23} height={23} alt='Devflow Logo' />
                <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden'>
                    Dev<span className='text-primary-500'>Flow</span>
                </p>
            </Link>
            <p>Global Search</p>
            <div className='flex-between gap-5'>
                Theme
            </div>
        </nav>
    )
}
