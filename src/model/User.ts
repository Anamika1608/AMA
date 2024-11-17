import mongoose, { Schema, Document } from "mongoose";

// typescript ki string is string
// mongoose ki string - String

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    expiryDate: Date,
    isVerified: boolean,
    isAccesptingMsg: boolean,
    message: Message[]
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please provide valid email address"]  // yh dekhna pdega
    },
    password: {
        type: String,
        required: [true, "Passwrod is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Code is required"]
    },
    expiryDate: {
        type: Date,
        required: [true, "Expiry Date is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAccesptingMsg: {
        type: Boolean,
        default: true
    },
    message: [messageSchema]
})

// typescript model - Model - to check if it exist and have model interface
// normal model - model - to create the new one

const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema))

export const messageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", messageSchema);

export default userModel;