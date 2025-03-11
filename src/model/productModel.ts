import mongoose from 'mongoose'


export interface IProduct {
    name: string;
    _id?:mongoose.Types.ObjectId;
    description: string;
    price: number;
    category: mongoose.Types.ObjectId;
    brand: string;
    sizes: "S" | "M" | "L" | "XL" | "XXL";
    image: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brand: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true
    },
    sizes:{
        type:String,
        required:true,
        enum:["S","M","L","XL","XXL"],
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)

export default Product