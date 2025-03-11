import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Category from "@/model/categoryModel"
import { NewspaperIcon } from "lucide-react"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 })
        }

        const { name, description } = await request.json()

        if (!name || !description) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        await connectDB() 

        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } })

        if (existingCategory) {
            return NextResponse.json({ error: "Category already exists" }, { status: 409 })

        }

        const newCategory = await Category.create({
            name,
            description
        })

        console.log(newCategory)

        return NextResponse.json(
            {
                message: "Category created successfully",
                category: {
                    id: newCategory._id,
                    name: newCategory.name,
                    description: newCategory.description
                }
            },
            { status: 201 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session ) {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 })
        }


        await connectDB() 

        const categories = await Category.find({})


        return NextResponse.json(
            {
                message: "Category created successfully",
                categories
            },
            { status: 201 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
