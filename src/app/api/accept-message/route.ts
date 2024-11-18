// toggle message accepting or not
// send message
// get all message of that user

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

// to update the accept message toggle

export async function Post(request: Request) {
    await dbConnect()
    console.log('calling get server session function- ', getServerSession(authOptions))

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

    const { acceptingMsg } = await request.json()

    try {
        const updatedUser = userModel.findByIdAndUpdate(user._id, { isAccesptingMsg: acceptingMsg }, { new: true })
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update the user accepting message."
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Accept Message value updated",
                updatedUser
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("error in toggling the accept message api", error)
        return Response.json(
            {
                success: false,
                message: "Error in updating accepting msg toggle."
            },
            {
                status: 500
            }
        )
    }
}

// to get the status of accept message of loggedinuser

export async function Get(request: Request) {
    await dbConnect()
    console.log('calling get server session function- ', getServerSession(authOptions))

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
    const userId = user._id
    try {
        const foundUser = await userModel.findById(userId)
        if (!foundUser) {

            return Response.json(
                {
                    success: false,
                    message: "User does not exist in DB"
                },
                {
                    status: 401
                }
            )

        } else {
            return Response.json(
                {
                    success: true,
                    message: "User messages fetched successfully",
                    isAcceptingMessage: user.isAcceptingMsg
                },
                {
                    status: 200
                }
            )
        }
    } catch (error) {
        console.log("error in toggling the accept message api", error)
        return Response.json(
            {
                success: false,
                message: "Error in getting accepting message value."
            },
            {
                status: 500
            }
        )
    }


}
