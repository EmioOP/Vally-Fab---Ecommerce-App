import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import User from "@/model/userModel";
import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({

            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid Credentials")
                }

                try {
                    await connectDB()
                    const user = await User.findOne({ email: credentials.email })
                    if (!user) {
                        throw new Error("No user found with this email")
                    }
                    const passwordValid = await bcryptjs.compare(credentials.password, user.password)
                    if (!passwordValid) {
                        throw new Error("Invalid Password")
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        role: user.role
                    }
                } catch (error: any) {
                    console.error("Auth Error", error)
                    throw error
                }
            }
        })
    ],
    callbacks: {


        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },

        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role as string


            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET

}