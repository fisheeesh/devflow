import QuestionCard from "@/components/cards/question-card";
import DataRender from "@/components/data-render";
import LocalSearch from "@/components/search/local-search";
import ROUTES from "@/constants/routes";
import { EMPTY_COLLECTIONS } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.actions";
import { RouteParams } from "@/types/global";

export default async function Collection({ searchParams }: RouteParams) {
    const { page, pageSize, query, filter } = await searchParams

    const { success, data, error } = await getSavedQuestions({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query || "",
        filter: filter || ""
    })

    const { collection } = data || {}

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

            <div className="mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route={ROUTES.COLLECTION}
                    imgSrc='icons/search.svg'
                    placeholder="Search questions..."
                    otherClasses="flex-1"
                />
            </div>

            <DataRender
                success={success}
                error={error}
                data={collection}
                empty={EMPTY_COLLECTIONS}
                render={(collection) => (
                    <div className="mt-10 flex w-full flex-col gap-6">
                        {collection.map(item => (
                            <QuestionCard key={item._id} question={item.question} />
                        ))}
                    </div>
                )}
            />
        </>
    );

}
