import handleError from '@/lib/handlers/error'
import { ValidationError } from '@/lib/http-error'
import { AIAnswerSchema } from '@/lib/validations'
import { APIErrorResponse } from '@/types/global'
import { groq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { question, content } = await req.json()

    try {
        const validatedData = AIAnswerSchema.safeParse({ question, content })
        if (!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors)
        }

        const { text } = await generateText({
            model: groq("llama3-8b-8192"),
            prompt: `Generate a markdown-formatted response to the following question: ${question}. Based on the provided content: ${content}.`,
            system:
                "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax from headings, lists, code block, and emphasing where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' from Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.)."
        })

        return NextResponse.json({ success: true, data: text }, { status: 200 })

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}