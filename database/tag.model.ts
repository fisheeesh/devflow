import { model, models, Schema, Types } from "mongoose";

export interface ITag {
    name: string
    quesiton: number
}

const TagSchema = new Schema<ITag>({
    name: { type: String, required: true, unique: true },
    quesiton: { type: Number, default: 0 },

}, { timestamps: true });

const Tag = models?.tag || model<ITag>("Tag", TagSchema)

export default Tag;