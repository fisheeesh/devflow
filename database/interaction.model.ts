import { model, models, Schema, Types, Document } from "mongoose";

export interface IInteraction {
    user: Types.ObjectId,
    action: string,
    actionId: Types.ObjectId,
    actionType: "question" | "answer"
}

export interface IInteractionDoc extends IInteraction, Document { }

const InteractionSchema = new Schema<IInteraction>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    //* It can be upvote, downvote, view, askQuestion or whatever
    action: { type: String, required: true },
    /**
     * * It can be quesitonId if user view or answer specific question
     * * It can be answerId or userId if they are viewing specific user details
     */
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ['question', 'answer'], required: true }

}, { timestamps: true });

const Interaction = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema)

export default Interaction;