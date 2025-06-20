import { model, models, Schema, Types } from "mongoose";

export interface ITagQuestion {
    tag: Types.ObjectId
    question: Types.ObjectId
}

//* for easier and faster querying
const TagQuestionSchema = new Schema<ITagQuestion>({
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
}, { timestamps: true });

const TagQuestion = models?.tagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema)

export default TagQuestion;