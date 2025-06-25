import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

/**
 * * parse: Throws an error if validation fails. Use this when you have high confidence in the data’s structure and want to catch potential errors early.
 * * safeParse: Returns a result object containing either the parsed data on success or an error object on failure. This is ideal when dealing with less predictable data, allowing you to gracefully handle validation issues.
*/

export async function POST(request: Request) {
    const body = await request.json()
    try {
        await dbConnect();
        const validatedData = UserSchema.pick({ email: true }).safeParse({ body })
        if (validatedData.error) throw new ValidationError(validatedData.error.flatten().fieldErrors)

        const user = await User.findOne({ email: validatedData.data.email })
        if (!user) throw new NotFoundError('User')

        return NextResponse.json({ success: true, data: user }, { status: 200 })

    } catch (error) {
        return handleError(error, 'api') as APIErrorResponse
    }
}