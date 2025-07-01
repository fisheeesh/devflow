import Account from "@/database/account.model"
import handleError from "@/lib/handlers/error"
import { NotFoundError, ValidationError } from "@/lib/http-error"
import dbConnect from "@/lib/mongoose"
import { AccountSchema } from "@/lib/validation"
import { APIErrorResponse } from "@/types/global"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()

    try {
        await dbConnect()

        const validatedData = AccountSchema.pick({ providerAccountId: true }).safeParse(body)
        if (validatedData.error) throw new ValidationError(validatedData.error.flatten().fieldErrors)

        const account = await Account.findOne({ providerAccountId: validatedData.data.providerAccountId })
        if (!account) throw new NotFoundError('Account')

        return NextResponse.json({ success: true, data: account }, { status: 200 })
    }
    catch (error) {
        return handleError(error, 'api') as APIErrorResponse
    }
}