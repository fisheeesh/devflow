'use client'

import { useOutsideClick } from "@/hooks/useOutsideClick";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GlobalResult from "../global-result";
import { Input } from "../ui/input";

export default function GlobalSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const query = searchParams.get('global')
    const [search, setSearch] = useState(query || "")
    const [isOpen, setIsOpen] = useState(query || false)

    const searchContainerRef = useOutsideClick(() => {
        setIsOpen(false)
        setSearch('')
    })

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'global',
                    value: search
                })

                router.push(newUrl, { scroll: false })
            } else {
                if (query) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['global', 'type']
                    })

                    router.push(newUrl, { scroll: false })
                }
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [search, query, router, searchParams])


    return (
        <div
            className="relative w-full max-w-[600px] max-lg:hidden"
            ref={searchContainerRef}
        >
            <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
                <Image
                    src="/icons/search.svg"
                    alt="search"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
                <Input
                    type="search"
                    placeholder='Search anything globally...'
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!isOpen) setIsOpen(true)
                        if (e.target.value === '' && isOpen) setIsOpen(false)
                    }}
                    value={search}
                    className="dark:bg-background-light800_darkgradient paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
                />
            </div>
            {isOpen && <GlobalResult />}
        </div>
    )
}
