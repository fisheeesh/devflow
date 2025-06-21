import { model, models, Schema, Types, Document } from "mongoose";

export interface ITag {
    name: string
    quesiton: number
}

export interface ITagDoc extends ITag, Document { }

const TagSchema = new Schema<ITag>({
    name: { type: String, required: true, unique: true },
    quesiton: { type: Number, default: 0 },

}, { timestamps: true });

const Tag = models?.Tag || model<ITag>("Tag", TagSchema)

export default Tag;