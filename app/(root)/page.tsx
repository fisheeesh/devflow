import QuestionCard from "@/components/cards/question-card";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/local-search";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { getQuestions } from "@/lib/actions/question.actions";
import Link from "next/link";

export default async function Home(props: { searchParams: Promise<{ query: string, filter: string, page: string, pageSize: string }> }) {
  const { page, pageSize, query, filter } = await props.searchParams

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || ""
  })

  const { questions } = data || {}

  // const filterQuestion = questions.filter(q => {
  //   const matchesQuery = q.title.toLowerCase().includes(query?.toLowerCase())
  //   const matchesFilter = filter ? q.tags[0].name?.toLowerCase() === filter : true
  //   return matchesQuery && matchesFilter
  // })

  return (
    <>
      <section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button asChild className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc='icons/search.svg'
          placeholder="Search for Questions Here..."
          otherClasses="flex-1"
        />
      </section>

      <HomeFilter />
      {
        success ?
          (
            <div className="mt-10 flex w-full flex-col gap-6">
              {
                questions && questions.length > 0 ?
                  questions.map(question => (
                    <QuestionCard key={question._id} question={question} />
                  ))
                  : (
                    <div className="mt-10 flex w-full items-center justify-center">
                      <p className="text-dark400_light700">No questions found.</p>
                    </div>
                  )
              }
            </div>
          ) : (
            <div className="mt-10 w-full flex items-center justify-center">
              <p className="text-dark400_light700">{error?.message || 'Falied to fetch questions.'}</p>
            </div>
          )
      }
    </>
  );

}
