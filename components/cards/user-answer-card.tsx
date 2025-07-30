import ROUTES from "@/constants/routes"
import { getTimeStamp } from "@/lib/utils"
import { Answer } from "@/types/global"
import Link from "next/link"
import UserAvatar from "../user-avatar"
import Preview from "../editor/preview"
import Metric from "../metric"
import EditDeleteAction from "../user/edit-delete-action"
import { Suspense } from "react"
import Votes from "../votes/votes"
import { auth } from "@/auth"
import { hasVoted } from "@/lib/actions/vote.actions"

interface Props extends Answer {
    containerClasses?: string
    showReadMore?: boolean,
    showActionBtns?: boolean
}

export default async function UserAnswerCard({
    _id,
    author,
    content,
    createdAt,
    upvotes,
    downvotes,
    question,
    showActionBtns = false
}: Props) {
    const session = await auth()
    const hasVotedPromise = hasVoted({ targetId: _id, targetType: 'answer' })
    return (
        <article className='card-wrapper rounded-[10px] p-9 sm:px-11 relative'>
            <span id={`answer-${_id}`} className='hash-span' />

            <div className="flex items-center justify-end mb-5">
                <Suspense fallback={<div className='animate-pulse w-24 px-6 py-[10.5px] background-light700_dark300 rounded' />}>
                    <Votes
                        userId={session?.user?.id as string}
                        targetId={_id}
                        targetType='answer'
                        upvotes={upvotes}
                        downvotes={downvotes}
                        hasVotedPromise={hasVotedPromise}
                    />
                </Suspense>
            </div>

            {showActionBtns && (
                <div
                    className='background-light800 flex-center absolute -right-2 max-sm:right-0 -top-5 size-9 rounded-full'>
                    <EditDeleteAction type='Answer' itemId={_id} />
                </div>
            )}

            <div className="flex items-center flex-wrap gap-2 mb-5">
                <Preview content={content} />
                <Link
                    href={`/questions/${question}#answer-${_id}`}
                    className='body-semibold relative z-10 font-space-grotesk text-primary-500'
                >
                    <p className="">Read more...</p>
                </Link>
            </div>

            <div className='flex flex-2 items-center gap-1'>
                <UserAvatar
                    id={author._id}
                    name={author.name}
                    imageUrl={author.image}
                    fallbackClassName='text-[10px]'
                    className='size-5 rounded-full object-cover'
                />

                <Link href={ROUTES.PROFILE(author._id)} className='flex items-center max-sm:ml-1'>
                    <p className="body-semibold text-dark300_light700">{author.name ?? 'Anonymous'}</p>

                    <p className='small-regular text-light400_light500 ml-1 mt-1 line-clamp-1'>
                        <span className=""> • </span>
                        answered{" "}
                        {getTimeStamp(createdAt)}
                    </p>
                </Link>
            </div>
        </article>
    )
}
