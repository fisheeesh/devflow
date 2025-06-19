import QuestionForm from '@/components/forms/question-form'
import React from 'react'

export default function AskQuestionPage() {
    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
            <div className="mt-9 ">
                <QuestionForm />
            </div>
        </>
    )
}
