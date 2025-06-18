import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
    imgUrl: string,
    alt: string,
    value: string | number,
    title: string,
    href?: string,
    textStyles: string,
    imgStyles?: string,
    isAuthor?: boolean
}

export default function Metric({
    imgUrl, alt, value, title, href, textStyles, imgStyles, isAuthor
}: Props) {
    const metricContent = (
        <>
            <Image src={imgUrl} width={16} height={16} alt={alt} className={`rounded-full object-contain ${imgStyles}`} />

            <p className={`${textStyles} flex items-center gap-1`}>
                {value}

                <span className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden": ""}`}>{title}</span>
            </p>
        </>
    )
    return href ? (
        <Link className='flex-center gap-1' href={href}>{metricContent}</Link>
    ) : (
        <div className='flex-center gap-1'>{metricContent}</div>
    )
}
