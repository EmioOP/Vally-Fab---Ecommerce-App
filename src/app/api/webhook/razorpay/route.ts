import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'
import { connectDB } from "@/lib/db";
import Order from "@/model/orderModel";
import Product from "@/model/productModel";

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()

        const signature = request.headers.get('X-razorpay-signature')

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
            .update(body)
            .digest('hex')
        if (expectedSignature !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        const event = JSON.parse(body)

        await connectDB()

        if (event.event === 'payment.captured') {
            const payment = event.payload.payment.entity
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: payment.order_id },
                {
                    razorpayPaymentId: payment.id,
                    paymentStatus: "completed",

                }
            ).populate([
                { path: "products.product", select: "name price" },
                { path: "user", select: "name email" }
            ])

            if (!order) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }


            if (payment.notes?.productId && payment.notes?.quantity) {
                await Product.findByIdAndUpdate(payment.notes.product, {
                    $inc: { stock: -payment.notes.quantity },
                });
            } else {
                console.warn("Payment notes missing: Product ID or quantity is undefined.");
            }

            return NextResponse.json({ order }, { status: 200 })

        }

        return NextResponse.json({ message: 'success' }, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}