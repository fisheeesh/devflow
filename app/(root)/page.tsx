import LocalSearch from "@/components/search/local-search";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "What is React.JS?",
    description: "I am a description",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
    ],
    author: { _id: '1', name: 'John Doe' },
    upvotes: 10,
    answers: 2,
    views: 100,
    createdAt: new Date()
  },
  {
    _id: "2",
    title: "How to learn Javascript?",
    description: "I am a description",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Javascript" },
    ],
    author: { _id: '1', name: 'John Doe' },
    upvotes: 10,
    answers: 2,
    views: 100,
    createdAt: new Date()
  },
]

export default async function Home(props: { searchParams: Promise<{ query: string }> }) {
  const { query = '' } = await props.searchParams

  const filterQuestion = questions.filter(q => q.title.toLowerCase().includes(query?.toLowerCase()))

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
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>

      {/* HomeFilter */}

      <div className="mt-10 flex w-full flex-col gap-6">
        {
          filterQuestion.map(question => (
            <h1 key={question._id}>{question.title}</h1>
          ))
        }
      </div>
    </>
  );

}
