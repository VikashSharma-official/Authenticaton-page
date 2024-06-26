import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/newuser')
.then(()=>{
    console.log("mongodb is connected succesfully ")
})
.catch((error)=>{
    console.error("message error ",error)
})

const userSchema = new mongoose.Schema({
    username:{
        type:String,   
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

const User = mongoose.model("user",userSchema)
export default User;