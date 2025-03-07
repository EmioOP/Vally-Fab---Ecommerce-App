import mongoose from 'mongoose'


interface ICategory {
    name:string,
    description:string,
    createdAt:Date,
    updatedAt:Date
}

const categorySchema = new mongoose.Schema<ICategory>({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})


const Category = mongoose.models.categories || mongoose.model<ICategory>("Category",categorySchema)

export default Category