import ROUTES from "@/constants/routes"
import Image from "next/image"
import Link from "next/link"
import TagCard from "../cards/tag-card"

const hotQuestions = [
    { _id: "1", title: 'How to create a custom hook in React?' },
    { _id: "2", title: 'How to use React Query?' },
    { _id: "3", title: 'What is the difference between useEffect and useLayoutEffect in React?' },
    { _id: "4", title: 'What is the difference between useEffect and useLayoutEffect in React?' },
    { _id: "5", title: 'What is the difference between useEffect and useLayoutEffect in React?' },
]

const popularsTags = [
    { _id: '1', name: 'react', questions: 100 },
    { _id: '2', name: 'javascript', questions: 400 },
    { _id: '3', name: 'typescript', questions: 50 },
    { _id: '4', name: 'nextjs', questions: 10 },
    { _id: '5', name: 'react-query', questions: 75 },
]

export default function RightSideBar() {
    return (
        <section className='pt-32 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden'>
            <div>
                <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>

                <div className='mt-7 flex w-full flex-col gap-[30px]'>
                    {
                        hotQuestions.map(({ _id, title }) => (
                            <Link
                                className="cursor-pointer flex items-center justify-between gap-7"
                                key={_id}
                                href={ROUTES.PROFILE(_id)}>
                                <p className="body-medium text-dark500_light700">{title}</p>
                                <Image src='/icons/chevron-right.svg' alt="Chevron" width={20} height={20} className="invert-colors" />
                            </Link>
                        ))
                    }
                </div>
            </div>

            <div className="mt-16">
                <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>

                <div className="mt-7 flex flex-col gap-4">
                    {
                        popularsTags.map(({ _id, name, questions }) => (
                            <TagCard key={_id} _id={_id} name={name} questions={questions} showCount compact />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}
