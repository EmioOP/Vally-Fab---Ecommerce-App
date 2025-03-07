import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Product from "@/model/productModel"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url);
 


        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const query = searchParams.get('query') || '';

        const skip = (page - 1) * limit;
        const filter = query ? { name: { $regex: query, $options: "i" } } : {};

        console.log(limit,page,query)

        await connectDB()
        
        const products = await Product.find(filter).skip(skip).limit(limit).lean()
        if (!products || products.length === 0) {
            return NextResponse.json({ message: "No products found" }, { status: 404 })
        }

        return NextResponse.json({ products }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session?.user?.role !== 'admin'){
            return NextResponse.json({error:"Unauthorized Request"},{status:401})
        }
        await connectDB()

        
        const body = await request.json()
       

        if(!body.name || !body.price || !body.category || !body.brand || !body.sizes || !body.image || !body.stock){
            return NextResponse.json({error:"All fields are required"},{status:400})
        }

        

        const product = await Product.create({
            name: body.name,
            description: body.description,
            price: body.price,
            category: body.category,
            brand: body.brand,
            sizes: body.sizes,
            image: `${process.env.NEXT_PUBLIC_URL_ENDPOINT}${body.image}`,
            stock: body.stock
        })

        if(!product){
            return NextResponse.json({error:"Product creation failed"},{status:400})
        }

        return NextResponse.json({product},{status:201})

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({error:"Internal server error"},{status:500})
    }
}