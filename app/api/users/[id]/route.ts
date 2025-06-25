import User from "@/database/user.model"
import handleError from "@/lib/handlers/error"
import { NotFoundError } from "@/lib/http-error"
import dbConnect from "@/lib/mongoose"
import { UserSchema } from "@/lib/validation"
import { APIErrorResponse } from "@/types/global"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) throw new NotFoundError('User')

    try {
        await dbConnect()
        const user = await User.findById(id) 
        if (!user) throw new NotFoundError('User')

        return NextResponse.json({ success: true, data: user }, { status: 200 })

    } catch (error) {
        return handleError(error, 'api') as APIErrorResponse
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) throw new NotFoundError('User')

    try {
        await dbConnect()

        const user = await User.findByIdAndDelete(id)
        if (!user) throw new NotFoundError('User')

        return NextResponse.json({ success: true, data: user }, { status: 200 })
    }
    catch (error) {
        return handleError(error, 'api') as APIErrorResponse
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) throw new NotFoundError('User')

    try {
        await dbConnect()
        const body = await request.json()
        const validatedData = UserSchema.partial().parse(body)

        //* By passing new, it will return the obj after updated not before updated as default
        const updatedUser = await User.findByIdAndUpdate(id, validatedData, { new: true })
        if (!updatedUser) throw new NotFoundError('User')

        return NextResponse.json({ success: true, data: updatedUser }, { status: 200 })

    } catch (error) {
        return handleError(error, 'api') as APIErrorResponse
    }
}