import QuestionCard from '@/components/cards/question-card'
import DataRender from '@/components/data-render'
import Pagination from '@/components/pagination'
import LocalSearch from '@/components/search/local-search'
import ROUTES from '@/constants/routes'
import { EMPTY_QUESTION } from '@/constants/states'
import { getTagQuestions } from '@/lib/actions/tag.actions'
import { RouteParams } from '@/types/global'

export default async function TagDetailPage({ params, searchParams }: RouteParams) {
    const { id } = await params
    const { page, pageSize, query } = await searchParams

    const { success, data, error } = await getTagQuestions({
        tagId: id,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query
    })

    const { tag, questions, isNext } = data || {}

    return (
        <>
            <section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
                <h1 className="h1-bold text-dark100_light900">Tag: <i className='text-light-500'>&quot;{tag?.name}&quot;</i></h1>
            </section>

            <section className="mt-10">
                <LocalSearch
                    route={ROUTES.TAG(id)}
                    imgSrc='/icons/search.svg'
                    placeholder="Search questions..."
                    otherClasses="flex-1"
                />
            </section>

            <DataRender
                success={success}
                error={error}
                data={questions}
                empty={{
                    title: "Ahh, No Questions Yet!",
                    message:
                        "The question board is empty. Maybe it’s waiting for your brilliant question to get things rolling",
                    button: {
                        text: "Ask a Question",
                        href: '/ask-question'
                    },
                }}
                render={(questions) => (
                    <div className="mt-10 flex w-full flex-col gap-6">
                        {questions.map(question => (
                            <QuestionCard key={question._id} question={question} />
                        ))}
                    </div>
                )}
            />

            {!!questions?.length && <Pagination
                page={page}
                isNext={isNext || false}
            />}
        </>
    )
}
