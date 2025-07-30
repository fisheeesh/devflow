import { auth } from '@/auth'
import QuestionForm from '@/components/forms/question-form'
import { redirect } from 'next/navigation'

export default async function AskQuestionPage() {
    const session = await auth()

    if (!session) return redirect('/sign-in')

    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
            <div className="mt-10">
                <QuestionForm />
            </div>
        </>
    )
}
