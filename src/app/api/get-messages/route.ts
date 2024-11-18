import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

// to get all the messages of the user
export async function Get(request: Request) {
    dbConnect()

    const session: any = await getServerSession(authOptions)

    const user: User = session.user

    if (!session.user || !session) {
        return Response.json(
            {
                success: false,
                message: "User is not logged in"
            },
            {
                status: 401
            }
        )
    }

    try {
        const foundUser = userModel.findById(user._id)
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User does not exist in database"
                },
                {
                    status: 404
                }
            )
        } else {
            const userId = new mongoose.Types.ObjectId(user._id)
            try {
                const user = await userModel.aggregate([
                    { $match: { _id: userId } },
                    { $unwind: '$messages' },
                    { $sort: { 'messages.createdAt': -1 } },
                    { $group: { _id: '$_id', messages: { $push: '$messages' } } }
                ])
                if (!user || user.length == 0) {
                    return Response.json(
                        {
                            success: false,
                            message: "User not found"
                        },
                        {
                            status: 401
                        }
                    )
                }
                return Response.json(
                    {
                        success: true,
                        message: user[0].messages
                    },
                    {
                        status: 200
                    }
                )
            } catch (error) {
                console.log("error in aggregating the messages", error)
                return Response.json(
                    {
                        success: false,
                        message: "Error in aggregating the messages"
                    },
                    {
                        status: 500
                    }
                )
            }
        }
    } catch (error) {
        console.log("error in getting all messages", error)
        return Response.json(
            {
                success: false,
                message: "Error in getting all messages"
            },
            {
                status: 500
            }
        )
    }
}