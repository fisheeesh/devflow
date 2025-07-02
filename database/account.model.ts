import { Document, model, models, Schema, Types } from "mongoose";

export interface IAccount {
    userId: Types.ObjectId;
    name: string;
    //* e.g., 'github', 'google', 'credentials'
    provider: string;
    providerAccountId: string;
    image?: string;
    password?: string;
}

export interface IAccountDoc extends IAccount, Document { }

const AccountSchema = new Schema<IAccount>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    image: { type: String },
    password: { type: String },
}, { timestamps: true });

const Account = models?.Account || model<IAccount>("Account", AccountSchema)

export default Account;