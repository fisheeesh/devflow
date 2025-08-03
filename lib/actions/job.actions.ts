import { JobFilterParams } from "@/types/action"
import { UserLocation } from "@/types/global"

export async function fetchLocation() {
    try {
        const res = await fetch(`http://ip-api.com/json?fields=country,countryCode,city`)
        const location = await res.json()

        return {
            country: location.country,
            countryCode: location.countryCode,
            city: location.city.toString().replace(" ", "")
        } as UserLocation
    } catch (error) {
        console.log(error)
    }
}

export async function fetchCountries() {
    try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images")
        const countries = await res.json()

        return countries.data
    } catch (error) {
        console.log(error)
    }
}

export async function fetchJobs(filter: JobFilterParams) {
    try {
        const { query, page, location } = filter

        const res = await fetch(`https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&country=${location}`, {
            method: 'GET',
            headers: {
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
            }
        })

        const result = await res.json()

        return result.data
    } catch (error) {
        console.log(error)
    }
}