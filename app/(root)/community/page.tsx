import UserCard from '@/components/cards/user-card'
import DataRender from '@/components/data-render'
import CommonFilter from '@/components/filters/common-filter'
import Pagination from '@/components/pagination'
import LocalSearch from '@/components/search/local-search'
import { UserFilters } from '@/constants/filter'
import ROUTES from '@/constants/routes'
import { EMPTY_USERS } from '@/constants/states'
import { getAllUsers } from '@/lib/actions/user.actions'
import { RouteParams } from '@/types/global'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Community",
}

export default async function CommunityPage({ searchParams }: RouteParams) {
    const { page, pageSize, query, filter } = await searchParams

    const { success, data, error } = await getAllUsers({
        page: Number(page) || 1, pageSize: Number(pageSize) || 10, filter, query
    })

    const { users, isNext } = data || {}

    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">All Users</h1>

            <div className="mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route={ROUTES.COMMUNITY}
                    iconPosition='left'
                    imgSrc='/icons/search.svg'
                    placeholder='There are some great devs here!'
                    otherClasses='flex-1'
                />
                <CommonFilter
                    filters={UserFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <DataRender
                data={users}
                success={success}
                empty={EMPTY_USERS}
                error={error}
                render={(users) => (
                    <div className="mt-10 flex flex-wrap gap-5">
                        {users.map(user => (
                            <UserCard key={user._id} {...user} />
                        ))}
                    </div>
                )}
            />

            {!!users?.length && <Pagination
                page={page}
                isNext={isNext || false}
            />}
        </div>
    )
}
