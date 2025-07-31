import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <>
            <h1 className='h1-bold text-dark100_light900 text-3xl'>Tags</h1>

            <div className="mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <Skeleton className='h-14 flex-1 max-sm:hidden' />
                <Skeleton className='h-14 w-full sm:w-28' />
                <Skeleton className='h-14 hidden max-sm:block w-full' />
            </div>

            <div className="mt-12 flex flex-wrap gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                    <Skeleton
                        key={item}
                        className='h-54 w-full rounded-2xl sm:w-[223px]'
                    />
                ))}
            </div>
        </>
    )
}
