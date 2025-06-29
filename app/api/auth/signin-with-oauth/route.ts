import Account from "@/database/account.model"
import User from "@/database/user.model"
import handleError from "@/lib/handlers/error"
import { ValidationError } from "@/lib/http-error"
import dbConnect from "@/lib/mongoose"
import { SignInWithOAuthSchema } from "@/lib/validation"
import { APIErrorResponse } from "@/types/global"
import mongoose from "mongoose"
import { NextResponse } from "next/server"
import slugify from "slugify"

export async function POST(request: Request) {
    const { provider, providerAccountId, user } = await request.json()

    await dbConnect()

    //* By starting mongoose session, it allows us to start a new transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const validatedData = SignInWithOAuthSchema.safeParse({ provider, providerAccountId, user })
        if (!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors)

        const { name, username, email, image } = user

        const slugifyUsername = slugify(username, {
            lower: true,
            strict: true,
            trim: true
        })

        let existingUser = await User.findOne({ email }).session(session)

        if (!existingUser) {
            [existingUser] = await User.create(
                [{ name, username: slugifyUsername, email, image }], { session })
        } else {
            const updatedData: { name?: string, image?: string } = {}

            if (existingUser.name !== name) updatedData.name = name
            if (existingUser.image !== image) updatedData.image = image

            if (Object.keys(updatedData).length > 0) {
                await User.updateOne(
                    { _id: existingUser._id },
                    { $set: updatedData }
                ).session(session)
            }
        }

        const existingAccount = await Account.findOne({
            userId: existingUser._id,
            provider,
            providerAccountId
        }).session(session)

        if (!existingAccount) {
            await Account.create([
                {
                    userId: existingUser._id,
                    name,
                    image,
                    provider,
                    providerAccountId
                }
            ], { session })
        }

        //* We made all of the changes to db atomically
        await session.commitTransaction()

        return NextResponse.json({ success: true })

    } catch (error: unknown) {
        //* If sth went wrong, we're gonna rollback all the changes
        await session.abortTransaction()
        return handleError(error, 'api') as APIErrorResponse
    }
    finally {
        session.endSession()
    }
}