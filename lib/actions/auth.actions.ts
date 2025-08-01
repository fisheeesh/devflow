"use server"

import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignInSchema, SignUpSchema } from "../validations";
import User from "@/database/user.model";
import bcrypt from "bcryptjs"
import mongoose from "mongoose";
import Account from "@/database/account.model";
import { signOut, signIn } from "@/auth";
import { NotFoundError } from "../http-error";
import { AuthCredentials } from "@/types/action";

export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: SignUpSchema })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { name, username, email, password } = validationResult.params!

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const existingUser = await User.findOne({ email }).session(session)
        if (existingUser) {
            throw new Error('User already exits.')
        }

        const existingUsername = await User.findOne({ username }).session(session)
        if (existingUsername) {
            throw new Error('Username already exits.')
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const [newUser] = await User.create(
            [{ username, name, email }],
            { session }
        )

        await Account.create([{
            userId: newUser._id,
            name,
            provider: 'credentials',
            providerAccountId: email,
            password: hashPassword
        }], { session })

        await session.commitTransaction()

        await signIn('credentials', {
            email, password, redirect: false
        })

        return { success: true }

    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    }
    finally {
        await session.endSession()
    }
}

export async function signInWithCredentials(
    params: Pick<AuthCredentials, 'email' | 'password'>
): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: SignInSchema })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { email, password } = validationResult.params!

    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) throw new NotFoundError('User')

        const existingAccountWithId = await Account.findOne({
            userId: existingUser._id
        })

        const hashPassword = await bcrypt.hash(password, 10)

        const existingAccountWithCredentials = await Account.findOne({
            provider: 'credentials',
            providerAccountId: email
        })

        if (existingUser && existingAccountWithId && !existingAccountWithCredentials) {
            await Account.create([{
                userId: existingUser._id,
                name: existingUser.name,
                provider: 'credentials',
                providerAccountId: email,
                password: hashPassword
            }])

            await signIn('credentials', {
                email, password, redirect: false
            })

            return { success: true }
        }
        
        if (!existingAccountWithCredentials) throw new NotFoundError('Account')

        const passwordMatch = await bcrypt.compare(password, existingAccountWithCredentials.password)
        if (!passwordMatch) throw new Error('Password does not match.')

        await signIn('credentials', {
            email, password, redirect: false
        })

        return { success: true }

    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function signOutUser() {
    await signOut()
}