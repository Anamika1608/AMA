import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from 'bcryptjs'
import randomstring from 'randomstring'
import { sendEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, password, email } = await request.json();
        const existingUserVerifiedByUsername = await userModel.findOne({ username, isVerified: true })
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: true,
                    message: "Username already taken"
                },
                {
                    status: 200
                }
            )
        }
        const otp = randomstring.generate({ length: 5, charset: '123456789' });
        const expirtyDate = new Date();
        expirtyDate.setHours(expirtyDate.getHours() + 1);
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUserVerifiedByEmail = await userModel.findOne({ email });
        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exits"
                }, { status: 500 })
            }
            else {

                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = otp;
                // new Date(Date.now() + 3600000)
                existingUserVerifiedByEmail.expirtyDate = expirtyDate
                await existingUserVerifiedByEmail.save();
            }

        } else {

            const newUser = new userModel({
                email,
                password: hashedPassword,
                username,
                isVerified: false,
                verifyCode: otp,
                expirtyDate,
                isAccesptingMsg: true,
                message: []
            });

            await newUser.save();

        }
        // send verifiaction email
        const emailResponse = await sendEmail(email, username, otp);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        } else {
            return Response.json({
                success: true,
                message: "User registered successfully. Pls verify your email"
            }, { status: 200 })
        }


    } catch (error) {
        console.log("Error in registering user-", error);
        return Response.json(
            {
                success: false,
                message: "Error in registering the user"
            },
            {
                status: 500
            }
        )
    }
} 