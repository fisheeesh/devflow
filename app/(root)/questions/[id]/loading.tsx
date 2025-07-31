import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className='space-y-3.5'>
            <div className="flex items-center justify-end">
                <Skeleton className='w-24 px-6 py-[10.5px] rounded' />
            </div>

            <div className="flex items-center gap-2">
                <Skeleton className='w-6 h-6 rounded-full' />
                <Skeleton className='w-32 h-5' />
            </div>

            <Skeleton className='w-full h-6' />

            <div className='flex items-center gap-2'>
                <Skeleton className='w-24 h-5' />
                <Skeleton className='w-16 h-5' />
                <Skeleton className='w-16 h-5' />
            </div>

            {[1, 2, 3, 4, 5].map((item) => (
                <div className='space-y-2 mt-5' key={item}>
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-full h-[300px]' />
                </div>
            ))}
        </div>
    )
}
