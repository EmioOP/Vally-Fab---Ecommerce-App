import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/model/orderModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";


var razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 })
        }

        const { product, quantity = 1, shippingAddress } = await request.json()

        if (!product) {
            return NextResponse.json({ error: "Invalid Request" }, { status: 400 })
        }

        if (
            !product?._id ||
            typeof product.amount !== "number" ||
            !shippingAddress ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode ||
            !shippingAddress.phone
        ) {
            return NextResponse.json(
                { error: "Invalid order parameters" },
                { status: 400 }
            );
        }

        await connectDB()

        // create razorpay order

        const order = await razorpay.orders.create({
            amount: Math.round(product.amount * 100),
            currency: "INR",
            receipt: `${product._id}-${Date.now()}`,
            notes: {
                productId: product._id.toString(),
                quantity: quantity
            }
        })

        const newOrder = await Order.create({
            user: session.user.id,
            products: [{ product: product._id, quantity: quantity, size: product.size }],
            amount: product.amount,
            status: "processing",
            razorpayOrderId: order.id,
            shippingAddress: {
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode:shippingAddress.pincode,
                phone: shippingAddress.phone
            },
            paymenyStatus: "pending"
        })

        return NextResponse.json({
            orderid: order.id,
            amount: order.amount,
            currency: order.currency,
            dbOrderId: newOrder.key_id
        })


    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}