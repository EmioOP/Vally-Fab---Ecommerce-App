import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

interface IUser {
    username:string;
    password:string;
    email:string;
    role:"user" | "admin";
    _id?:mongoose.Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
    }

const userSchema = new mongoose.Schema<IUser>({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
},{timestamps:true})


userSchema.pre("save",async function(next){
    if(this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password,10)
    }
    next()
})

const User = mongoose.models.users || mongoose.model<IUser>("users",userSchema)

export default User