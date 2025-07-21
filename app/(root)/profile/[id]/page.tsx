import { auth } from '@/auth'
import UserAvatar from '@/components/user-avatar'
import ProfileLink from '@/components/user/profile-link'
import { getUser } from '@/lib/actions/user.actions'
import { RouteParams } from '@/types/global'
import { notFound } from 'next/navigation'

import dayjs from 'dayjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Stats from '@/components/user/stats'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default async function ProfilePage({ params }: RouteParams) {
    const { id } = await params
    if (!id) notFound()

    const loggedInUser = await auth()
    const { success, data, error } = await getUser({
        userId: id
    })

    if (!success) return (
        <div className='h1-bold text-dark100_light900'>{error?.message}</div>
    )

    const { user, totalQuestions, totalAnswers } = data!

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
                        <p className="paragraph-regular text-dark200_light800">@{username}</p>

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
                                    title="Portfolio"
                                />
                            }
                            <ProfileLink
                                imgUrl="/icons/calendar.svg"
                                href={portfolio}
                                title={dayjs(createdAt).format('MMMM YYYY')}
                            />
                        </div>

                        {
                            bio && (
                                <p className='paragraph-regular text-dark400_light800'>{bio}</p>
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
                                <Button className='paragraph-medium btn-secondary text-dark300_light900 min-h-12 minw-44 px-4 py-3'>
                                    Edit
                                </Button>
                            </Link>
                        )
                    }
                </div>
            </section>

            <Stats
                totalQuestions={totalQuestions}
                totalAnswers={totalAnswers}
                badges={{
                    GOLD: 0,
                    SILVER: 0,
                    BRONZE: 0
                }}
            />

            <section className="mt-10 flex gap-10">
                <Tabs defaultValue="top-posts" className="flex-[2]">
                    <TabsList className='background-light800_dark400 min-h-[42px] p-1'>
                        <TabsTrigger value="top-posts" className='tab'>Top Posts</TabsTrigger>
                        <TabsTrigger value="answers" className='tab'>Answers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="top-posts" className='mt-5 flex w-full flex-col gap-6'>
                        List of questions
                    </TabsContent>
                    <TabsContent value="answers" className='flex w-full flex-col gap-6'>
                        List of answres
                    </TabsContent>
                </Tabs>

                <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
                    <h3 className='h3-bold text-dark200_light900'>Top Tags</h3>
                    <div className="mt-7 flex- flex-col gap-4">
                        <p>List of Tags</p>
                    </div>
                </div>
            </section>
        </>
    )
}
