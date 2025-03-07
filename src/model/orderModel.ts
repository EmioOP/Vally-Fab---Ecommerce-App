import mongoose from 'mongoose'


export interface IOrder {
    user: mongoose.Types.ObjectId;
    products: 
        {
            product: mongoose.Types.ObjectId;
            quantity: number;
            size: string

        }[];
    amount: number;
    status: "processing" | "shipped" | "delivered" | "cancelled";
    _id:mongoose.Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        pincode: string
    };
    paymentStatus: "pending" | "completed" | "failed";
    createdAt:Date;
    updatedAt:Date;

}


const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    products:
       [ {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, default: 1 },
            size: { type: String, required: true }
        }],
    amount: {
        type: Number,
        required: true,
        min:0
    },
    status: {
        type: String,
        required: true,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing"
    },
    razorpayOrderId: {
        type: String,
        unique:true
    },
    razorpayPaymentId: {
        type: String,
        unique:true
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    paymentStatus:{
        type:String,
        enum:["pending","completed","failed"],
        default:"pending"
    }


}, { timestamps: true })


const Order = mongoose.models.orders || mongoose.model<IOrder>("Order", orderSchema)

export default Order