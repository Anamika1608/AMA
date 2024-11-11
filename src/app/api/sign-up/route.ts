import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from 'bcryptjs'

import { sendEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request : Request) {
    await dbConnect();
    try {
        const {username , password , email} = await request.json();
        
    } catch (error) {
        console.log("Error in registering user-" , error);
        return Response.json(
            {
                success :  false,
                message : "Error in registering the user"
            },
            {
                status : 500
            }
        )
    }
} 