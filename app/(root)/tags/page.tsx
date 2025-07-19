import TagCard from '@/components/cards/tag-card'
import DataRender from '@/components/data-render'
import CommonFilter from '@/components/filters/common-filter'
import LocalSearch from '@/components/search/local-search'
import { TagFilters } from '@/constants/filter'
import ROUTES from '@/constants/routes'
import { EMPTY_TAGS } from '@/constants/states'
import { getTags } from '@/lib/actions/tag.actions'
import { RouteParams } from '@/types/global'

export default async function TagsPage({ searchParams }: RouteParams) {
    const { page, pageSize, query, filter } = await searchParams

    const { success, data, error } = await getTags({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query,
        filter
    })

    const { tags } = data || {}

    return (
        <>
            <h1 className='h1-bold text-dark100_light900 text-3xl'>Tags</h1>
            <div className="mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route={ROUTES.TAGS}
                    imgSrc='/icons/search.svg'
                    placeholder='Search tags...'
                    otherClasses='flex-1'
                />
                <CommonFilter
                    filters={TagFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <DataRender
                success={success}
                data={tags}
                error={error}
                empty={EMPTY_TAGS}
                render={(tags) => (
                    <div className='mt-10 flex w-full flex-wrap gap-4'>
                        {
                            tags.map(tag => <TagCard key={tag._id} {...tag} />)
                        }
                    </div>
                )}
            />
        </>
    )
}
