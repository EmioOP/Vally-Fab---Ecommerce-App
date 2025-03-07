import { authOptions } from "@/lib/auth"
import Category from "@/model/categoryModel"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"


export async function POST(request:NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if(!session || session.user?.role !== "admin"){
            return NextResponse.json({error:"Unauthorized Request"},{status:401})
        }

        const {name,description} = await request.json()

        if(!name || !description){
            return NextResponse.json({error:"All fields are required"},{status:400})
        }

        const category = await Category.create({
            name,
            description
        })

        if(!category){
            return NextResponse.json({error:"Category creation failed"},{status:400})
        }

        return NextResponse.json({category},{status:201})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Something went wrong'},{status:500})
    }
}


export async function GET(request:NextRequest){
    try {
        const categories = await Category.find({}).lean()

        if(!categories || categories.length === 0){
            return NextResponse.json({message:"No categories found"},{status:404})
        }

        return NextResponse.json({categories},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Something went wrong"},{status:500})
    }
}