"use client"

import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectItem } from "../ui/select"
import { formUrlQuery } from "@/lib/url"

interface Filter {
    name: string
    value: string
}

interface Props {
    filters: Filter[]
    otherClasses?: string
    containerClasses?: string
}

export default function CommonFilter({ filters, otherClasses = "", containerClasses = "" }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const paramsFilter = searchParams.get('filter')

    const handleUpdateParams = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'filter',
            value
        })

        router.push(newUrl, { scroll: false })
    }

    return (
        <div className={cn('relative', containerClasses)}>
            <Select onValueChange={handleUpdateParams} defaultValue={paramsFilter || undefined}>
                <SelectTrigger
                    aria-label="Filter options"
                    className={cn('body-regular w-full no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-1.5', otherClasses)}
                >
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select a filter" />
                    </div>
                </SelectTrigger>
                <SelectContent className="background-light900_dark200">
                    <SelectGroup>
                        {filters.map(item => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
