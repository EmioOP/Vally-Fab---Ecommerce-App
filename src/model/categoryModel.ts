import mongoose from 'mongoose'


export interface ICategory {
    name:string;
    description:string;
    _id:mongoose.Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const categorySchema = new mongoose.Schema<ICategory>({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})


const Category = mongoose.models.Category || mongoose.model<ICategory>("Category",categorySchema)

export default Category