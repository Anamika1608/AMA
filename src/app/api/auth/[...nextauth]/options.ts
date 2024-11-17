import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect"
import userModel from "@/model/User"
const jwtSecret = process.env.JWT_SECRET

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await userModel.findOne(
                        { email: credentials.email }
                    );
                    if (!user) {
                        throw new Error('No user found with this email')
                    }
                    if (user.isVerified) {
                        const passwordCompared = await bcrypt.compare(credentials.password, user.password);
                        if (!passwordCompared) throw new Error('Password is incorrect')
                        return user
                    } else {
                        throw new Error('User is not verified with this email')
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMsg = user.isAcceptingMsg
                token.userName = user.userName
            }
            return token
        }, 
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isAcceptingMsg = token.isAcceptingMsg
                session.user.isVerified = token.isVerified
                session.user.userName = token.userName
            }
            return session
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: jwtSecret
}
