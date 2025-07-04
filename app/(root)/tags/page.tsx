import { getTags } from '@/lib/actions/tag.actions'
import React from 'react'

export default async function TagsPage() {
    const { success, data, error } = await getTags({
        page: 1,
        pageSize: 2,
        query: 'javascript',
    })

    const { tags } = data || {}

    console.log('TAGS', JSON.stringify(tags, null, 2))

    return (
        <div>
            ga
        </div>
    )
}
