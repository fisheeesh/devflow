import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <section className='flex flex-col-reverse items-start justify-between sm:flex-row'>
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          {/* Avatar Skeleton */}
          <Skeleton className='size-[140px] rounded-full' />

          <div className='mt-3'>
            {/* Name Skeleton */}
            <Skeleton className="h-8 w-48 mb-2" />

            {/* Username Skeleton */}
            <Skeleton className="h-5 w-32 mb-5" />

            {/* Profile Links Skeleton */}
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>

            {/* Bio Skeleton */}
            <div className="mt-10 space-y-2">
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-full max-w-lg" />
              <Skeleton className="h-4 w-full max-w-sm" />
            </div>
          </div>
        </div>

        {/* Edit Profile Button Skeleton */}
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <Skeleton className="h-12 w-44" />
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <div className="my-5">
        {/* Stats Title Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          {/* Questions/Answers Card */}
          <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
            <div>
              <Skeleton className="h-5 w-8 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div>
              <Skeleton className="h-5 w-8 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Badge Cards */}
          {[1, 2, 3].map((index) => (
            <div key={index} className="light-border background-light900_dark300 justify-start flex flex-wrap items-center gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
              <Skeleton className="w-10 h-12" />
              <div>
                <Skeleton className="h-5 w-6 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="mt-10 flex w-full flex-col gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <Skeleton
              key={item}
              className='h-44 w-full rounded-[10px]'
            />
          ))}
        </div>
      </div>
    </>
  )
}