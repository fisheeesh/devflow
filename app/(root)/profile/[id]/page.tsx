import { auth } from '@/auth'
import AnswerCard from '@/components/cards/answer-card'
import QuestionCard from '@/components/cards/question-card'
import TagCard from '@/components/cards/tag-card'
import DataRender from '@/components/data-render'
import Pagination from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserAvatar from '@/components/user-avatar'
import ProfileLink from '@/components/user/profile-link'
import Stats from '@/components/user/stats'
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from '@/constants/states'
import { getUser, getUserAnswers, getUserQuestions, getUserStats, getUserTags } from '@/lib/actions/user.actions'
import { RouteParams } from '@/types/global'
import dayjs from 'dayjs'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const generateMetadata = async ({ params }: RouteParams): Promise<Metadata> => {
    const { id } = await params
    const session = await auth()

    const { success, data } = await getUser({ userId: id })

    if (!success || !data) {
        return {
            title: 'User not found',
            description: 'This user does not exist'
        }
    }

    return {
        title: data.user._id === session?.user?.id ? 'My Profile' : data.user.name,
        description: data.user.bio
    }
}

export default async function ProfilePage({ params, searchParams }: RouteParams) {
    const { id } = await params
    const { page, pageSize } = await searchParams
    if (!id) notFound()

    const loggedInUser = await auth()
    const { success, data, error } = await getUser({
        userId: id
    })

    if (!success) return (
        <div className='h1-bold text-dark100_light900'>{error?.message}</div>
    )

    const { user } = data!

    const { data: userStats } = await getUserStats({ userId: id })

    const {
        success: userQuestionsSuccess,
        data: userQuestions,
        error: userQuestionsError } = await getUserQuestions({ userId: id, page: Number(page) || 1, pageSize: Number(pageSize) || 3 })
    const {
        success: userAnswersSuccess,
        data: userAnswers,
        error: userAnswersError } = await getUserAnswers({ userId: id, page: Number(page) || 1, pageSize: Number(pageSize) || 3 })

    const {
        success: userTopTagsSuccess,
        data: userTopTags,
        error: userTopTagsError } = await getUserTags({ userId: id })

    const { questions, isNext: hasMoreQuestions } = userQuestions!

    const { answers, isNext: hasMoreAnswers } = userAnswers!

    const { tags } = userTopTags!

    const { _id, name, username, image, portfolio, location, bio, createdAt, reputation } = user

    return (
        <>
            <section className='flex flex-col-reverse items-start justify-between sm:flex-row'>
                <div className="flex flex-col items-start gap-4 lg:flex-row">
                    <UserAvatar
                        id={_id}
                        name={name}
                        imageUrl={image}
                        className='size-[140px] rounded-full object-cover'
                        fallbackClassName='text-6xl font-bolder'
                    />
                    <div className='mt-3'>
                        <h2 className='h2-bold text-dark100_light900'>{name}</h2>
                        <p className="paragraph-regular text-light-500">@{username}</p>

                        <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                            {
                                portfolio && <ProfileLink
                                    imgUrl="/icons/link.svg"
                                    href={portfolio}
                                    title="Portfolio"
                                />
                            }
                            {
                                location && <ProfileLink
                                    imgUrl="/icons/location.svg"
                                    title={location}
                                />
                            }
                            <ProfileLink
                                imgUrl="/icons/calendar.svg"
                                title={dayjs(createdAt).format('MMMM YYYY')}
                            />
                        </div>

                        {
                            bio && (
                                <p className='paragraph-regular text-dark400_light800 mt-10'>{bio}</p>
                            )
                        }
                    </div>
                </div>

                <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
                    {
                        loggedInUser?.user?.id === id && (
                            <Link
                                href='/profile/edit'
                            >
                                <Button className='paragraph-medium cursor-pointer btn-secondary text-dark300_light900 min-h-12 minw-44 px-8 py-3'>
                                    Edit Profile
                                </Button>
                            </Link>
                        )
                    }
                </div>
            </section>

            <Stats
                totalQuestions={userStats?.totalQuestions || 0}
                totalAnswers={userStats?.totalAnswers || 0}
                badges={userStats?.badges || { GOLD: 0, SILVER: 0, BRONZE: 0 }}
                reputationPoints={reputation || 0}
            />

            <section className="mt-10 flex gap-10">
                <Tabs defaultValue="top-posts" className="flex-[2]">
                    <TabsList className="p-1 min-h-[42px] bg-light-800 dark:bg-dark-400 relative z-10">
                        <TabsTrigger value="top-posts" className="tab">
                            Top Posts
                        </TabsTrigger>
                        <TabsTrigger value="answers" className="tab">
                            Answers
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-5">
                        <TabsContent value="top-posts" className='flex w-full flex-col gap-6'>
                            <DataRender
                                success={userQuestionsSuccess}
                                error={userQuestionsError}
                                data={questions}
                                empty={EMPTY_QUESTION}
                                render={(questions) => (
                                    <div className='flex w-full flex-col gap-6'>
                                        {
                                            questions.map(question =>
                                                <QuestionCard
                                                    question={question}
                                                    key={question._id}
                                                    showActionBtns={loggedInUser?.user?.id === question.author._id}
                                                />
                                            )
                                        }
                                    </div>
                                )}
                            />

                            {!!questions.length && <Pagination
                                page={page}
                                isNext={hasMoreQuestions}
                            />}
                        </TabsContent>

                        <TabsContent value="answers" className='flex w-full flex-col gap-6'>
                            <DataRender
                                success={userAnswersSuccess}
                                error={userAnswersError}
                                data={answers}
                                empty={EMPTY_ANSWERS}
                                render={(answers) => (
                                    <div className='flex w-full flex-col gap-10'>
                                        {
                                            answers.map(answer =>
                                                <AnswerCard
                                                    key={answer._id}
                                                    {...answer}
                                                    content={answer.content.slice(0, 50)}
                                                    showReadMore
                                                    showActionBtns={loggedInUser?.user?.id === answer.author._id}
                                                />)
                                        }
                                    </div>
                                )}
                            />

                            {!!answers.length && <Pagination
                                page={page}
                                isNext={hasMoreAnswers}
                            />}
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="flex w-full min-w-[250px] flex-1 flex-col max-[1400px]:hidden">
                    <h3 className='h3-bold text-dark200_light900'>Top Tags</h3>
                    <div className="mt-7 flex- flex-col gap-4">
                        <DataRender
                            success={userTopTagsSuccess}
                            error={userTopTagsError}
                            data={tags}
                            empty={EMPTY_TAGS}
                            render={(tags) => (
                                <div className='mt-3 flex w-full flex-col gap-4'>
                                    {
                                        tags.map(tag =>
                                            <TagCard
                                                key={tag._id}
                                                _id={tag._id}
                                                name={tag.name}
                                                questions={tag.count}
                                                showCount
                                                compact
                                            />)
                                    }
                                </div>
                            )}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}