import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Cart from "@/model/cartModel";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(request: NextRequest, { params }: { params: { id: string, productId: string } }) {
    try {
        //checking the user is logged in or not
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 400 })
        }

        //taking cartid, productId and quantity
        const { id, productId } = await params
        const { quantity } = await request.json()
        const ownerId = session.user?.id

        //checking everything has valid objectId
        if (!isValidObjectId(ownerId) || !isValidObjectId(id) || !isValidObjectId(productId)) {
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 })

        }

        await connectDB()

        //getting the user cart
        const cart = await Cart.findOne({ _id: id, owner: ownerId })

        if (!cart) {
            // other logics
            const cart = await Cart.create({ productId, quantity })
        }

        //search if the product is already present in the cart

        const addedProduct = cart.items?.find((item: any) => item.productId.toString() === productId)


        //checking the product is already in the cart if true setting the quantity as new quantity from frontend
        if (addedProduct) {
            addedProduct.quantity = quantity
        } else {
            // it adds the product to the cart
            cart.items.push({
                productId,
                quantity
            })
        }

        //saving the cart
        const updatedCart = await cart.save({ saveBeforeValidation: true })

        return NextResponse.json({ updatedCart }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

