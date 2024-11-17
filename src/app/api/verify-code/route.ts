import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function Post(request: Request) {
    dbConnect()
    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username) // it decodes the username value in the URL - like if it has space it will be %20 in url so to get the actual username
        const userSavedData = await userModel.findOne({ username: decodedUsername })
        if (!userSavedData) {
            return Response.json(
                {
                    success: false,
                    message: "User do not exist"
                },
                {
                    status: 404
                }
            )
        }
        const isCodeVerified = code === userSavedData?.verifyCode
        const isCodeNotExpired = new Date(userSavedData.expiryDate) > new Date()

        if (!isCodeVerified) {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect verification code"
                },
                {
                    status: 400
                }
            )
        }
        if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code is expired. Please signup again to get a new code."
                },
                {
                    status: 400
                }
            )
        }
        if (isCodeVerified && isCodeNotExpired) {
            userSavedData.isVerified = true
            await userSavedData.save()
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully!"
                },
                {
                    status: 200
                }
            )
        }
    } catch (error) {
        console.log("error in verifying otp", error);
        return Response.json(
            {
                success: false,
                message: "error in verifying otp"
            },
            {
                status: 500
            }
        )
    }
}