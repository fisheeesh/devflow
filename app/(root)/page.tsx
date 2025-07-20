import QuestionCard from "@/components/cards/question-card";
import DataRender from "@/components/data-render";
import CommonFilter from "@/components/filters/common-filter";
import HomeFilter from "@/components/filters/home-filter";
import Pagination from "@/components/pagination";
import LocalSearch from "@/components/search/local-search";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.actions";
import { RouteParams } from "@/types/global";
import Link from "next/link";

export default async function Home({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || ""
  })

  const { questions, isNext } = data || {}

  return (
    <>
      <section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button asChild className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.HOME}
          imgSrc='icons/search.svg'
          placeholder="Search for Questions Here..."
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>

      <HomeFilter />

      <DataRender
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
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
  );

}
