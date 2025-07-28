import JobCard from "@/components/cards/job-card";
import JobsFilter from "@/components/filters/jobs-filter";
import Pagination from "@/components/pagination";
import { fetchCountries, fetchJobs, fetchLocation } from "@/lib/actions/job.actions";
import { Job, RouteParams } from "@/types/global";

export default async function FindJobsPage({ searchParams }: RouteParams) {
    const { query, location, page } = await searchParams;
    const userLocation = await fetchLocation();

    const jobs = await fetchJobs({
        query: location ? "jobs" : (query ? query : `Software Engineer in ${userLocation?.city}`),
        page: page ?? 1,
        location: location ?? userLocation?.countryCode
    });

    const countries = await fetchCountries();
    const parsedPage = parseInt(page ?? 1);

    return (
        <div>
            <h2 className="h1-bold text-dark100_light900">Jobs</h2>

            <div className="flex">
                <JobsFilter countriesList={countries} defaultCountry={userLocation?.countryCode} />
            </div>
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

            {jobs?.length > 0 && (
                <Pagination page={parsedPage} isNext={jobs?.length === 10} />
            )}

        </div>
    )
}
