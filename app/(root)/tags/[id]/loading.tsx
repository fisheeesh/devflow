import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <>
            <Skeleton className="h-10 w-36" />
            <Skeleton className='h-14 w-full mt-10' />

            <div className="mt-10 flex w-full flex-col gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                    <Skeleton
                        key={item}
                        className='h-44 w-full rounded-[10px]'
                    />
                ))}
            </div>
        </>
    )
}
