'use client'

import { GlobalSearchFilters } from "@/constants/filter";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function GlobalFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const typeParams = searchParams.get('type')
    const [active, setActive] = useState(typeParams || "")

    const handleTypeClick = (item: string) => {
        let newUrl = "";
        if (item === active) {
            setActive('')
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['type']
            })
        } else {
            setActive(item)
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'type',
                value: item.toLowerCase()
            })
        }

        router.push(newUrl, { scroll: false })
    }

    return (
        <div className="flex items-center gap-5 px-5">
            <p className="text-dark400_light900 body-medium">Type:</p>
            <div className="flex gap-3">
                {GlobalSearchFilters.map((item) => (
                    <button
                        type="button"
                        key={item.value}
                        className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize ${active === item.value
                            ? "bg-primary-500 text-light-900"
                            : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500"
                            }`}
                        onClick={() => handleTypeClick(item.value)}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
