import mongoose,{Schema} from "mongoose";

const SaleSchema = new Schema({
    user:{type: Schema.ObjectId,ref:'user',required:true},
    currency_payment:{type: String,default: 'USD'},
    method_payment:{type:String,maxlength: 50,required:true},
    n_transacccion: {type:String,maxlength: 200,required:true},
    total:{type:Number,required:true},
    // 
    currency_total: {type: String, maxlength: 50, default: 'USD'},
    price_dolar:{type:Number,default: 0},
},{
    timestamps: true,
});

const Sale = mongoose.model("sale",SaleSchema);

export default Sale;