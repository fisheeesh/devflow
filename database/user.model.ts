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

const UserSchema = new Schema(
    {
        name: { type: String, require: true },
        username: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        bio: { type: String },
        image: { type: String, require: true },
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