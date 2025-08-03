import { fetchJobs } from '@/lib/actions/job.actions';
import { Job, UserLocation } from '@/types/global';
import JobCard from './cards/job-card';
import Pagination from './pagination';

interface Props {
    query: string
    location: string
    page: string
    userLocation?: UserLocation
}

export default async function JobList({ query, location, page, userLocation }: Props) {
    const jobs = await fetchJobs({
        query: location ? "jobs" : (query ? query : `Software Engineer in ${userLocation?.city}`),
        page: page ?? 1,
        location: location ?? userLocation?.countryCode
    });

    const parsedPage = parseInt(page ?? 1);

    return (
        <>
            <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
                {jobs?.length > 0 ? (
                    jobs
                        ?.filter((job: Job) => job.job_title)
                        .map((job: Job) => <JobCard key={job.job_id} job={job} />)
                ) : (
                    <div className="paragraph-regular text-dark200_light800 w-full text-center">
                        Oops! We couldn&apos;t find any jobs at the moment. Please try again
                        later
                    </div>
                )}
            </section>

            {
                jobs?.length > 0 && (
                    <Pagination page={parsedPage} isNext={jobs?.length === 10} />
                )
            }
        </>
    )
}
