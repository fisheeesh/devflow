import ROUTES from '@/constants/routes'
import Link from 'next/link'
import React from 'react'
import { Badge } from '../ui/badge'
import { cn, getDeviconClassName } from '@/lib/utils'
import Image from 'next/image'
import { getTechDescription } from '@/lib/tech-map'

interface Props {
    _id: string,
    name: string,
    questions?: number,
    showCount?: boolean,
    compact?: boolean,
    remove?: boolean,
    isButton?: boolean,
    handleRemove?: () => void
}

export default function TagCard({
    _id,
    name,
    questions,
    showCount,
    compact,
    remove,
    isButton,
    handleRemove
}: Props) {

    const iconClass = getDeviconClassName(name)
    const iconDescription = getTechDescription(name)

    const Content = (
        <>
            <Badge className='subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase flex flex-row gap-2'>
                <div className="flex-center space-x-2">
                    <i className={`${iconClass} text-sm`}></i>
                    <span>{name}</span>
                </div>
                {remove && (
                    <Image src='/icons/close.svg' alt='Close' width={12} height={12} className='cursor-pointer object-contain invert-0 dark:invert' onClick={handleRemove} />
                )}
            </Badge>
            {showCount && (
                <p className='small-medium text-dark500_light700'>{questions}</p>
            )}
        </>
    )

    if (compact) {
        return isButton ?
            (
                <button type='button' className='flex justify-between gap-2'>{Content}</button>
            ) :
            (
                <Link href={ROUTES.TAG(_id)} className='flex items-center justify-between gap-2'>
                    {Content}
                </Link>
            )
    }

    return (
        <Link href={ROUTES.TAG(_id)} className='shadow-light100_darknone'>
            <article className='background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-6 py-8 sm:w-[225px]'>
                <div className='flex items-center justify-between gap-3'>
                    <div className='background-light800_dark400 w-fit rounded-sm px-3.5 py-1.5'>
                        <p className="text-sm font-semibold text-dark300_light900">{name}</p>
                    </div>
                    <i className={cn(iconClass, 'text-2xl')} aria-hidden="true" />
                </div>

                <p className='small-medium text-dark500_light700 mt-5 line-clamp-3 w-ful'>
                    {iconDescription}
                </p>

                <p className="small-medium text-dark400_light500 mt-3.5">
                    <span className='body-semibold primary-text-gradient mr-2.5'>
                        {questions}+
                    </span>
                    Questions
                </p>
            </article>
        </Link>
    )
}
