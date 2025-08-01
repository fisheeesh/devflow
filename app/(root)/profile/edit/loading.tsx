import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function Loading() {
    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

            <div className="mt-10 flex w-full flex-col gap-10">
                {
                    [1, 2, 3, 4].map((item) => (
                        <div key={item} className="space-y-2">
                            <Skeleton className="w-24 h-4 rounded-sm" />
                            <Skeleton className='min-h-[56px] w-full rounded-[10px]' />
                            <Skeleton className="w-64 h-4" />
                        </div>
                    ))
                }

                <div className="space-y-2">
                    <Skeleton className="w-24 h-4 rounded-sm" />
                    <Skeleton className='h-[200px] w-full rounded-[10px]' />
                    <Skeleton className="w-64 h-4" />
                </div>
            </div>

            <div className="flex justify-end items-center">
                <Skeleton className='h-14 w-28' />
            </div>
        </div >
    )
}
