'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formUrlQuery } from '@/lib/url';
import { Country } from '@/types/global';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LocalSearch from '../search/local-search';

interface Props {
    countriesList: Country[],
    defaultCountry?: string,
}

export default function JobsFilter({ countriesList, defaultCountry }: Props) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleUpdateParams = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            value,
            key: 'location'
        })

        router.push(newUrl, { scroll: false })
    }

    return (
        <div className="relative mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
            <LocalSearch
                route={pathname}
                iconPosition="left"
                imgSrc="/icons/job-search.svg"
                placeholder="Job Title, Company, or Keywords"
                otherClasses="flex-1 max-sm:w-full"
            />

            <Select onValueChange={(value) => handleUpdateParams(value)} defaultValue={defaultCountry || undefined}>
                <SelectTrigger className="body-regular no-focus light-border background-light800_dark300 text-dark500_light700 line-clamp-1 flex min-h-[56px] items-center gap-3 border p-4 sm:max-w-[210px]">
                    <Image
                        src="/icons/carbon-location.svg"
                        alt="location"
                        width={18}
                        height={18}
                    />
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select Location" />
                    </div>
                </SelectTrigger>

                <SelectContent className="body-semibold max-h-[350px] max-w-[250px] background-light900_dark200">
                    <SelectGroup>
                        {countriesList ? (
                            countriesList.map((country: Country) => (
                                <SelectItem
                                    key={country.name}
                                    value={country.iso2}
                                    className="px-4 py-3"
                                >
                                    {country.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="No results found">No results found</SelectItem>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
