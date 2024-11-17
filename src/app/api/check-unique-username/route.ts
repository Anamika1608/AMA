import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function Get(request: Request) {

    if (request.method != "Get") {
        return Response.json({
            success: false,
            message: "Only Get method is allowed"
        }, { status: 405 })
    }
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url) // for search params
        const queryParams = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams)
        console.log(result);
        if (!result.success) {
            console.log('error in validating username - ', result.error)
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: (usernameErrors?.length > 1) ? usernameErrors.join(',') : "Invalid username"
            })
        }
        const { username } = result.data
        const existingVerifiedUser = await userModel.findOne({ username, isVerified: true })
        if (!existingVerifiedUser) {
            return Response.json({
                success: true,
                message: "Username is available"
            }, { status: 200 })
        } else {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 400 })
        }

    } catch (error) {
        console.log("error in checking username", error);
        return Response.json(
            {
                success: false,
                message: "error in checking username"
            },
            {
                status: 500
            }
        )
    }
}

