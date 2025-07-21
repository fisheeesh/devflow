import ROUTES from "@/constants/routes"
import Image from "next/image"
import Link from "next/link"
import TagCard from "../cards/tag-card"
import { getHotQuestions } from "@/lib/actions/question.actions"
import DataRender from "../data-render"
import { getTopTags } from "@/lib/actions/tag.actions"

export default async function RightSideBar() {
    const [
        { success, data: hotQuestions, error },
        { success: tagSuccess, data: tags, error: tagsError }
    ] = await Promise.all([
        getHotQuestions(),
        getTopTags()
    ])

    return (
        <section className='no-scrollbar background-light900_dark200 light-border flex flex-col gap-6 border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden w-[350px] h-full overflow-y-auto'>
            <div>
                <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>

                <DataRender
                    data={hotQuestions}
                    empty={{
                        title: "No questions found.",
                        message: "No questions have been asked yet."
                    }}
                    success={success}
                    error={error}
                    render={(hotQuestions) => (
                        <div className='mt-7 flex w-full flex-col gap-[30px]'>
                            {
                                hotQuestions.map(({ _id, title }, index) => (
                                    <Link
                                        className="cursor-pointer flex items-start justify-between gap-7"
                                        key={_id}
                                        href={ROUTES.QUESTION(_id)}
                                    >
                                        <div className="flex gap-2 items-start">
                                            <div className="flex items-start justify-start flex-shrink-0 mt-0.5">
                                                <div
                                                    style={{
                                                        width: '25px',
                                                        height: '25px',
                                                        mask: 'url(/icons/question.svg) no-repeat center',
                                                        maskSize: 'contain',
                                                        WebkitMask: 'url(/icons/question.svg) no-repeat center',
                                                        WebkitMaskSize: 'contain',
                                                        background: index % 2 === 0
                                                            ? 'linear-gradient(129deg, #ff7000 0%, #e2995f 100%)'
                                                            : '#1DA1F2'
                                                    }}
                                                />
                                            </div>
                                            <p className="body-medium text-dark500_light700 line-clamp-2">{title}</p>
                                        </div>
                                        <Image
                                            src='/icons/chevron-right.svg'
                                            alt="Chevron"
                                            width={20}
                                            height={20}
                                            className="invert-colors flex-shrink-0 mt-1"
                                        />
                                    </Link>

                                ))
                            }
                        </div>
                    )}
                />
            </div>

            <div className="mt-16">
                <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>

                <DataRender
                    data={tags}
                    empty={{
                        title: "No tags found.",
                        message: "No tags have been created yet."
                    }}
                    success={tagSuccess}
                    error={tagsError}
                    render={(tags) => (
                        <div className="mt-7 flex flex-col gap-4">
                            {
                                tags.map(({ _id, name, questions }) => (
                                    <TagCard
                                        key={_id}
                                        _id={_id}
                                        name={name}
                                        questions={questions}
                                        showCount
                                        compact
                                    />
                                ))
                            }
                        </div>
                    )}
                />
            </div>
        </section>
    )
}