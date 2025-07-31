import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ROUTES from '@/constants/routes'
import Link from 'next/link'

export default function Loading() {
    return (
        <section>
            <section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Button asChild className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                    <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
                </Button>
            </section>

            <div className="mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <Skeleton className='h-14 w-full' />
                <Skeleton className='h-14 sm:w-28 hidden max-md:flex' />
            </div>

            <div className='mt-10 flex flex-wrap gap-3 max-md:hidden'>
                <Skeleton className='px-[49.5px] py-[18px] rounded-lg ' />
                <Skeleton className='px-[49.5px] py-[18px] rounded-lg ' />
                <Skeleton className='px-[49.5px] py-[18px] rounded-lg ' />
                <Skeleton className='px-[49.5px] py-[18px] rounded-lg ' />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                    <Skeleton
                        key={item}
                        className='h-44 w-full rounded-[10px]'
                    />
                ))}
            </div>
        </section>
    )
}
