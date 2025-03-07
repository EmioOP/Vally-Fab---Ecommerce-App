import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/model/orderModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 })
        }

        await connectDB()

        const orders = await Order.find({ user: session.user?.id })
            .populate({
                path: "products.product",
                select: "name image",
                options: { strictPopulate: false }
            })
            .sort({ createdAt: -1 })
            .lean()

        if (orders.length === 0) {
            return NextResponse.json({ message: "No orders found" }, { status: 404 })
        }

        return NextResponse.json({ orders }, { status: 200 })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
} 
