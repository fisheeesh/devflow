"use client"

import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/url'

interface Props {
    route: string,
    imgSrc: string,
    placeholder: string,
    otherClasses?: string
}

export default function LocalSearch({ route, imgSrc, placeholder, otherClasses }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || ""

    const [searchQuery, setSearchQuery] = useState(query)

    useEffect(() => {
        //* Debouncing is a way to control how often a function runs
        //* Debounce for optimization
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'query',
                    value: searchQuery
                })

                router.push(newUrl, { scroll: false })
            }
            else {
                if (pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["query"]
                    })

                    router.push(newUrl, { scroll: false })
                }
            }
        }, 300)

        //* Whenever we use Timeout in useEffect we wanna make sure to put at the end
        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery, router, route, searchParams, pathname])

    return (
        <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
            <Image
                src={imgSrc}
                alt='Search'
                width={24}
                height={24}
                className='cursor-pointer'
            />
            <Input
                type='text'
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none'
            />
        </div>
    )
}
