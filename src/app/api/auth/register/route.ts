import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { connectDB } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const { email, password, username } = await request.json()
        if (!email || !password || !username) {
            return NextResponse.json({ error: "Please provide email , password and username" }, { status: 400 })
        }

        await connectDB()

        const existedUser = await User.findOne({
            $or:[{email},{username}]
        })

        if(existedUser){
            return NextResponse.json({error:"User with same email or username is already exists"})
        }


         await User.create({
            email,
            password,
            username
        })

        return NextResponse.json({message:"User registered successfully"},{status:201})


    } catch (error: any) {
        console.log("Register error",error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}