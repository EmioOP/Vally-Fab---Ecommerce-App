import { authOptions } from "@/lib/auth";
import Cart from "@/model/cartModel";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if(!session?.user){
            return NextResponse.json({error:"Unauthorized Request"},{status:400})
        }

        const ownerId = session.user?.id 

        if(!isValidObjectId(ownerId)){
            return NextResponse.json({error:"Invalid user id"},{status:400})

        }

        const cart = await Cart.find({
            owner:ownerId
        }).populate("items.productId")

        if(!cart){
            return NextResponse.json({error:"Unable fetch cart for the user"},{status:400})

        }

        return NextResponse.json({message:"cart fetched",cart},{status:200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

