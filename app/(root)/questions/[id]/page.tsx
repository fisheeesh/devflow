import { auth } from '@/auth';
import AllAnswers from '@/components/answers/all-answers';
import TagCard from '@/components/cards/tag-card';
import Preview from '@/components/editor/preview';
import AnswerForm from '@/components/forms/answer-form';
import Metric from '@/components/metric';
import SaveQuestion from '@/components/questions/save-question';
import UserAvatar from '@/components/user-avatar'
import Votes from '@/components/votes/votes';
import ROUTES from '@/constants/routes';
import { getAnswers } from '@/lib/actions/answer.actions';
import { hasSavedQuestion } from '@/lib/actions/collection.actions';
import { getQuestion, incrementViews } from '@/lib/actions/question.actions';
import { hasVoted } from '@/lib/actions/vote.actions';
import { formatNumber, getTimeStamp } from '@/lib/utils';
import { RouteParams, Tag } from '@/types/global'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { Suspense } from 'react';

// /**
//  * * We can only do parallel req if a req does not depend on another
//  * ? It can still lead to challenges like slower reqs, blocking rendering,
//  * ? increased server load, error handling and complexity or race conditions
//  */
// const [_, { success, data: question }] = await Promise.all([
//     await incrementViews({ questionId: id }),
//     await getQuestion({ questionId: id })
// ])

export default async function QuestionDetails({ params }: RouteParams) {
    const session = await auth()
    const { id } = await params

    const { success, data: question } = await getQuestion({ questionId: id })

    after(async () => {
        await incrementViews({ questionId: id })
    })

    if (!success || !question) return redirect('/404')

    const { success: areAnswersLoaded, data: answersResult, error: answersError } = await getAnswers({ questionId: id, page: 1, pageSize: 10, filter: 'latest' })

    const hasVotedPromise = hasVoted({ targetId: question._id, targetType: 'question' })

    const hasSavedQuestionPromise = hasSavedQuestion({ questionId: question._id })

    const { author, createdAt, answers, views, tags, content, title } = question

    return (
        <>
            {/* <View questionId={id} /> */}
            <div className='flex-start w-full flex-col'>
                <div className="flex w-full flex-col-reverse justify-between">
                    <div className="flex items-center justify-start gap-1">
                        <UserAvatar
                            imageUrl={author.image}
                            id={author._id}
                            name={author.name}
                            className='size-[22px]'
                            fallbackClassName='text-[10px]'
                        />
                        <Link href={ROUTES.PROFILE(author._id)}>
                            <p className='paragraph-semibold text-dark300_light700'>
                                {author.name}
                            </p>
                        </Link>
                    </div>

                    <div className="flex justify-end items-center gap-4">
                        <Suspense fallback={<div className='animate-pulse w-24 px-6 py-[10.5px] background-light700_dark300 rounded' />}>
                            <Votes
                                userId={session?.user?.id as string}
                                upvotes={question.upvotes}
                                downvotes={question.downvotes}
                                targetId={question._id}
                                targetType="question"
                                hasVotedPromise={hasVotedPromise}
                            />
                        </Suspense>

                        <Suspense fallback={<div className='animate-pulse w-3 px-6 py-[10.5px] background-light700_dark300 rounded' />}>
                            <SaveQuestion
                                userId={session?.user?.id as string}
                                questionId={question._id}
                                hasSavedQuestionPromise={hasSavedQuestionPromise} />
                        </Suspense>
                    </div>
                </div>

                <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full'>
                    {title}
                </h2>
            </div>

            <div className='mb-8 mt-5 flex flex-wrap gap-4'>
                <Metric
                    imgUrl='/icons/clock.svg'
                    alt='clock icon'
                    value={` Asked ${getTimeStamp(new Date(createdAt))}`}
                    title=''
                    textStyles='small-regular text-dark400_light700'
                />
                <Metric
                    imgUrl='/icons/message.svg'
                    alt='message icon'
                    value={answers}
                    title=''
                    textStyles='small-regular text-dark400_light700'
                />
                <Metric
                    imgUrl='/icons/eye.svg'
                    alt='eye icon'
                    value={formatNumber(views)}
                    title=''
                    textStyles='small-regular text-dark400_light700'
                />
            </div>

            <Preview content={content} />

            <div className="mt-8 flex flex-wrap gap-2">
                {
                    tags.map((tag: Tag) => (
                        <TagCard
                            key={tag._id}
                            _id={tag._id as string}
                            name={tag.name}
                            compact
                        />
                    ))
                }
            </div>

            <section className="my-5">
                <AllAnswers data={answersResult?.answers} success={areAnswersLoaded} error={answersError} totalAnswers={answersResult?.totalAnswers || 0} />
            </section>

            <section className="my-5">
                <AnswerForm userId={session?.user?.id as string} questionId={question._id} questionTitle={question.title} questionContent={question.content} />
            </section>
        </>
    )
}
