import QuestionCard from "@/components/cards/question-card";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/local-search";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "What is React.JS?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
    ],
    author: { _id: '1', name: 'John Doe', image: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png" },
    upvotes: 10,
    answers: 2,
    views: 100,
    createdAt: new Date()
  },
  {
    _id: "2",
    title: "How to learn Javascript?",
    tags: [
      { _id: "1", name: "Javascript" },
      { _id: "2", name: "Javascript" },
    ],
    author: { _id: '1', name: 'John Doe', image: "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg" },
    upvotes: 10,
    answers: 2,
    views: 100,
    createdAt: new Date('2021-12-12')
  },
]

// const test = async () => {
//   try {
//     throw new ValidationError({
//       title: ['Required'],
//       tags: ['"Javascript" is not a valid tag.']
//     })
//   }
//   catch (error) {
//     return handleError(error)
//   }
// }

export default async function Home(props: { searchParams: Promise<{ query: string, filter: string }> }) {
  const { query = '', filter = "" } = await props.searchParams

  const filterQuestion = questions.filter(q => {
    const matchesQuery = q.title.toLowerCase().includes(query?.toLowerCase())
    const matchesFilter = filter ? q.tags[0].name?.toLowerCase() === filter : true
    return matchesQuery && matchesFilter
  })

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

      <div className="mt-10 flex w-full flex-col gap-6">
        {
          filterQuestion.map(question => (
            <QuestionCard key={question._id} question={question} />
          ))
        }
      </div>
    </>
  );

}
