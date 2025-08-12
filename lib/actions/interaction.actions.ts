"use server"

import { CreateInteractionParams, UpdateReputationParams } from "@/types/action";
import { CreateInteractionSchema } from "../validations";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { IInteractionDoc } from "@/database/interaction.model";
import { convertToPlainObject } from "../utils";
import action from "../handlers/action";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Interaction, User } from "@/database";

export async function createInteraction(params: CreateInteractionParams): Promise<ActionResponse<IInteractionDoc>> {
    const validationResult = await action({ params, schema: CreateInteractionSchema, authorize: true })
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {
        action: actionType,
        actionTarget,
        actionId,
        authorId //* target user who owns the content (question/answer)
    } = validationResult.params!
    const userId = validationResult.session!.user!.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const [interaction] = await Interaction.create(
            [{
                user: userId,
                action: actionType,
                actionId,
                actionType: actionTarget
            }], { session }
        )

        // @TODO: Update reputation for both the performer and the content author
        await updateReputation({
            interaction,
            session,
            performerId: userId!,
            authorId
        })

        await session.commitTransaction()

        return {
            success: true,
            data: convertToPlainObject(interaction)
        }


    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }
}

export async function updateReputation(params: UpdateReputationParams) {
    const { interaction, session, performerId, authorId } = params
    const { action, actionType } = interaction

    let performerPoints = 0
    let authorPoints = 0

    switch (action) {
        case 'upvote':
            performerPoints = actionType === 'question' ? 10 : 5
            authorPoints = actionType === 'question' ? 20 : 10
            break;
        case 'downvote':
            performerPoints = actionType === 'question' ? -5 : -2
            authorPoints = actionType === 'question' ? -10 : -5
            break;
        case 'post':
            authorPoints = actionType === 'question' ? 50 : 25
            break;
        case 'delete':
            authorPoints = actionType === 'question' ? -50 : -25
            break;
        case "bookmark":
            authorPoints = 20
            performerPoints = 10
            break
        case "edit":
            authorPoints = 10
            break;
    }

    if (performerId === authorId) {
        await User.findByIdAndUpdate(
            performerId,
            { $inc: { reputation: authorPoints } },
            { session }
        )

        return
    }

    await User.bulkWrite([
        {
            updateOne: {
                filter: { _id: performerId },
                update: { $inc: { reputation: performerPoints } }
            }
        },
        {
            updateOne: {
                filter: { _id: authorId },
                update: { $inc: { reputation: authorPoints } }
            }
        }
    ], { session })
}