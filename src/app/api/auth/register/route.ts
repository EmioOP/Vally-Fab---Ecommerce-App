import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { connectDB } from "@/lib/db";
import Cart from "@/model/cartModel";

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
            return NextResponse.json({error:"User with same email or username is already exists"},{status:400})
        }


        const user = await User.create({
            email,
            password,
            username
        })

        if(!user){
            return NextResponse.json({error:"unable to create user"},{status:500})
            
        }
        const cart = await Cart.create({owner:user._id})


        return NextResponse.json({message:"User registered successfully"},{status:201})


    } catch (error: any) {
        console.log("Register error",error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}