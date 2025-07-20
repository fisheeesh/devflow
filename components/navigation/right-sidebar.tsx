import ROUTES from "@/constants/routes"
import Image from "next/image"
import Link from "next/link"
import TagCard from "../cards/tag-card"
import { getHotQuestions } from "@/lib/actions/question.actions"
import DataRender from "../data-render"
import { getTopTags } from "@/lib/actions/tag.actions"

export default async function RightSideBar() {
    const { success, data: hotQuestions, error } = await getHotQuestions()
    const { success: tagSuccess, data: tags, error: tagsError } = await getTopTags()

    console.log(tags)

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
                                hotQuestions.map(({ _id, title }) => (
                                    <Link
                                        className="cursor-pointer flex items-center justify-between gap-7"
                                        key={_id}
                                        href={ROUTES.QUESTION(_id)}>
                                        <div className="flex gap-2">
                                            <Image
                                                src='/icons/question.svg'
                                                alt="Question"
                                                width={25}
                                                height={25}
                                                className="text-blue-50"
                                            />
                                            <p className="body-medium text-dark500_light700 line-clamp-2">{title}</p>
                                        </div>
                                        <Image
                                            src='/icons/chevron-right.svg'
                                            alt="Chevron"
                                            width={20}
                                            height={20}
                                            className="invert-colors"
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