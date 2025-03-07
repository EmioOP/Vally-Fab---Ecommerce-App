import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Product, { IProduct } from "@/model/productModel"
import { Types } from "mongoose"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await props.params
        await connectDB()

        const product = await Product.findById(id).lean()

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }
        return NextResponse.json({ product }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }
}


export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 })
        }

        const { id } = await props.params
        console.log(id)
        await connectDB()


        const deletedProduct = await Product.findByIdAndDelete(id)

        if (!deletedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session?.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 })
        }

        const { id } = await params

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
        }

        const body = await request.json()



        if (!body.name || !body.price || !body.category || !body.brand || !body.sizes || !body.image || !body.stock) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        await connectDB()

        const updateProduct = await Product.findByIdAndUpdate<IProduct>(id, {
            name: body.name,
            description: body.description,
            price: body.price,
            category: body.category,
            brand: body.brand,
            sizes: body.sizes,
            stock: body.stock,
            image: body.image?.startsWith('http')
                ? body.image
                : `${process.env.NEXT_PUBLIC_URL_ENDPOINT}${body.image}`
        }, { new: true })

        if (!updateProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        console.log(updateProduct)


        return NextResponse.json({ product: updateProduct }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }
}