import ROUTES from '@/constants/routes'
import { hasVoted } from '@/lib/actions/vote.actions'
import { getTimeStamp } from '@/lib/utils'
import { Answer } from '@/types/global'
import Link from 'next/link'
import { Suspense } from 'react'
import Preview from '../editor/preview'
import UserAvatar from '../user-avatar'
import Votes from '../votes/votes'

export default function AnswerCard({ _id, author, content, createdAt, upvotes, downvotes }: Answer) {
    const hasVotedPromise = hasVoted({targetId: _id, targetType: 'answer'})

    return (
        <article className='light-border border-b py-10'>
            <span id={JSON.stringify(_id)} className='hash-span' />

            <div className='mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <div className='flex flex-2 items-start gap-1 sm:items-center'>
                    <UserAvatar
                        id={author._id}
                        name={author.name}
                        imageUrl={author.image}
                        fallbackClassName='text-[10px]'
                        className='size-5 rounded-full object-cover max-sm:mt-2'
                    />

                    <Link href={ROUTES.PROFILE(author._id)} className='flex flex-col sm:flex-row sm:items-center max-sm:ml-1'>
                        <p className="body-semibold text-dark300_light700">{author.name ?? 'Anonymous'}</p>

                        <p className='small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1'>
                            <span className='max-sm:hidden'> • </span>
                            answered{" "}
                            {getTimeStamp(createdAt)}
                        </p>
                    </Link>
                </div>

                <div className="flex justify-end">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Votes
                            targetId={_id}
                            targetType='answer'
                            upvotes={upvotes}
                            downvotes={downvotes}
                            hasVotedPromise={hasVotedPromise}
                        />
                    </Suspense>
                </div>
            </div>
            <Preview content={content} />
        </article>
    )
}
