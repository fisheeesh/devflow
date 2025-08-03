import { Skeleton } from './ui/skeleton'

export default function PlaceHolder() {
    return (
        <div className="mt-10 flex w-full flex-col gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <Skeleton
                    key={item}
                    className='h-44 w-full rounded-[10px]'
                />
            ))}
        </div>
    )
}
