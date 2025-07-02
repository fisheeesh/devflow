import Account from "@/database/account.model"
import handleError from "@/lib/handlers/error"
import { NotFoundError, ValidationError } from "@/lib/http-error"
import dbConnect from "@/lib/mongoose"
import { AccountSchema } from "@/lib/validations"
import { APIErrorResponse } from "@/types/global"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) throw new NotFoundError('Account')

    try {
        await dbConnect()

        const account = await Account.findById(id)
        if (!account) throw new NotFoundError('Account')

        return NextResponse.json({ success: true, data: account }, { status: 200 })
    } catch (error) {
        return handleError(error, 'api') as APIErrorResponse
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) throw new NotFoundError('Account')

    try {
        await dbConnect()
        const body = await request.json()

        const validatedData = AccountSchema.partial().safeParse(body)
        if (validatedData.error) throw new ValidationError(validatedData.error.flatten().fieldErrors)

        const account = await Account.findByIdAndUpdate(id, validatedData, { new: true })
        if (!account) throw new NotFoundError('Account')

        return NextResponse.json({ success: true, data: account }, { status: 200 })

    } catch (error) {
        return handleError(error, 'api') as APIErrorResponse
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) throw new NotFoundError('Account')

    try {
        await dbConnect()

        const account = await Account.findByIdAndDelete(id)

        if (!account) throw new NotFoundError('Account')

        return NextResponse.json({ success: true, data: account }, { status: 200 })
    } catch (error) {
        return handleError(error, 'api') as APIErrorResponse
    }
}