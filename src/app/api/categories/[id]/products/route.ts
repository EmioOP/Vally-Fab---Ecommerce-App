import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Category from "@/model/categoryModel";
import Product from "@/model/productModel";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 })
        }

        const { id } = await params


        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "invalid category id" }, { status: 409 })
        }

        await connectDB()

        const category = await Category.findById(id)

        console.log(category)

        if (!category) {
            return NextResponse.json({ error: "category not found" }, { status: 404 })

        }
        

        const products = await Product.find({category:category._id}).lean()

        if(!products ){
            return NextResponse.json({ error: "products not found" }, { status: 400 })
            
        }

        return NextResponse.json(products,{status:200})


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Something went wrong while getting cartegory" }, { status: 500 })
    }
}