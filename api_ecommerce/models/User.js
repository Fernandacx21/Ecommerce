import mongoose,{Schema} from "mongoose";

const UserSchema = new Schema({
    rol : {type: String,maxlength:30,required:true},
    name : {type: String,maxlength:250,required:true},
    surname: {type: String,maxlength:30,required:false},
    email : {type: String,maxlength:250,required:true,unique:true},
    password : {type: String,maxlength:250,required:true},
    avatar : {type: String,maxlength:30,required:false},
    state : {type: Number,default:1},//1 es activo y 2 es des activo
    phone : {type: String,maxlength:20,required:false},
    birthday : {type: String,maxlength:20,required:false},
},{
    timestamps: true
});

const User = mongoose.model("user",UserSchema);
export default User;