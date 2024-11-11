import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "@/types/apiResponse";

export async function sendEmail(email : string , username : string  , verifyCode : string) : Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `Hello ${username} , Complete your registration`,
            react: VerificationEmail({ username , otp: verifyCode }),
          });
        return {success : true , message : "Verification email sent successfully"}
        
    } catch (emailError) {
        console.error("Error in sending verification email" , emailError);
        return {success : false , message : "Failed to send verification email"}
    }
}

