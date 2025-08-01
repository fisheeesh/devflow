import { auth } from '@/auth'
import QuestionForm from '@/components/forms/question-form'
import ROUTES from '@/constants/routes'
import { getQuestion } from '@/lib/actions/question.actions'
import { RouteParams } from '@/types/global'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: "Edit Question",
}

export default async function EditQuestionPage({ params }: RouteParams) {
    const { id } = await params
    if (!id) notFound()

    const session = await auth()
    if (!session) return redirect('/sign-in')

    const { data: question, success } = await getQuestion({ questionId: id })
    if (!success) return notFound()

    if (question?.author._id.toString() !== session?.user?.id) redirect(ROUTES.QUESTION(id))

    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>Edit question</h1>
            <div className="mt-10">
                <QuestionForm question={question} isEdit />
            </div>
        </>
    )
}
