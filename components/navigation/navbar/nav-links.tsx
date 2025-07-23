"use client"

import { SheetClose } from '@/components/ui/sheet'
import { sidebarLinks } from '@/constants/index'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


export default function NavLinks({ isMobileNav = false, userId }: { isMobileNav?: boolean, userId?: string }) {
    const pathname = usePathname()

    return (
        <>
            {sidebarLinks.map(item => {
                const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route

                let dynamicRoute = item.route
                if (item.route === '/profile') {
                    if (userId) {
                        dynamicRoute = `${item.route}/${userId}`
                    }
                    else {
                        return null
                    }
                }

                const LinkComponent = (
                    <Link href={dynamicRoute} key={item.label} className={cn(isActive ? 'primary-gradient rounded-lg text-light-900' : 'text-dark300_light900',
                        isMobileNav ? "justify-start" : "justify-center lg:justify-start", "flex items-center gap-4 bg-transparent p-3.5"
                    )}>
                        <Image
                            src={item.imgURL}
                            alt={item.label}
                            width={20}
                            height={20}
                            className={cn({ 'invert-colors': !isActive })}
                        />
                        <p className={cn(isActive ? 'base-bold' : 'base-medium', !isMobileNav && 'max-lg:hidden')}>{item.label}</p>
                    </Link>
                )

                return isMobileNav ? (
                    <SheetClose asChild key={dynamicRoute}>
                        {LinkComponent}
                    </SheetClose>
                ) : (
                    <React.Fragment key={dynamicRoute}>{LinkComponent}</React.Fragment>
                )
            })}
        </>
    )
}
