import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Category from "@/model/categoryModel";
import Product from "@/model/productModel";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 })
        }

        const { id } = await params

        const { name, description } = await request.json()



        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "invalid category id" }, { status: 400 })
        }

        if (!name || !description) {
            return NextResponse.json({ error: "all fields are required" }, { status: 400 })

        }

        const updatedCategory = await Category.findByIdAndUpdate(id, {
            name,
            description
        }, {
            new: true
        })

        return NextResponse.json({ message: "Updated Category", updatedCategory }, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Something went wrong while updating cartegory" }, { status: 500 })
    }
}
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 })
        }

        const { id } = await params

        
        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "invalid category id" }, { status: 400 })
        }

        //TODO: checking that any product related to the category if so dont allow to delete

        // insted of this we can implement soft delete...search about it online
        const deletedCategory = await Category.findByIdAndDelete(id)


        return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Something went wrong while updating cartegory" }, { status: 500 })
    }
}
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

        const category = await Category.findById(id).lean()

        

        if (!category) {
            return NextResponse.json({ error: "category not found" }, { status: 404 })

        }

        return NextResponse.json(category,{status:200})


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Something went wrong while getting cartegory" }, { status: 500 })
    }
}