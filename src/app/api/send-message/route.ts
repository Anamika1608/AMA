import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { Message } from "@/model/User";

export async function Post(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
        if (!user.isAccesptingMsg) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages"
                },
                {
                    status: 403
                }
            )
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
                success: true,
                message: "Message sent successfully!"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("error in sending message", error)
        return Response.json(
            {
                success: false,
                message: "Error in sending message"
            },
            {
                status: 500
            }
        )
    }
}
