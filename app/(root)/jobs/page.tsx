import JobsFilter from "@/components/filters/jobs-filter";
import JobList from "@/components/job-list";
import PlaceHolder from "@/components/placeholder";
import { fetchCountries, fetchLocation } from "@/lib/actions/job.actions";
import { RouteParams } from "@/types/global";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Jobs",
}

export default async function FindJobsPage({ searchParams }: RouteParams) {
    const { query, page, location } = await searchParams
    const userLocation = await fetchLocation();
    const countries = await fetchCountries();

    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">Jobs</h1>

            <div className="flex">
                <JobsFilter countriesList={countries} defaultCountry={userLocation?.countryCode} />
            </div>
            <Suspense fallback={<PlaceHolder />} key={`${query}-${page}-${location}`}>
                <JobList query={query} location={location} page={page} userLocation={userLocation} />
            </Suspense>
        </div>
    )
}
