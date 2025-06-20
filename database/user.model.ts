import { model, Schema, models } from "mongoose";

export interface IUser {
    name: string;
    username: string;
    email: string;
    bio?: string;
    image: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        bio: { type: String },
        image: { type: String, required: true },
        location: { type: String },
        portfolio: { type: String },
        reputation: { type: Number, default: 0 },
    }, { timestamps: true }
);

//* Check if the model already exists to avoid overwriting it
//* This is useful in development mode where the server might restart and redefine the model
//* If the model exists, use it; otherwise, create a new one
//* This prevents the "OverwriteModelError" in Mongoose
const User = models?.user || model<IUser>("User", UserSchema)

export default User;