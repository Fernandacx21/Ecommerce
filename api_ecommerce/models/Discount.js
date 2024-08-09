import mongoose, {Schema} from "mongoose";

const DiscountSchema = new Schema({
    type_campaign: {type:Number, required:true, default: 1}, // 1 es capaña norma y 2 es venta flash
    type_discount: {type:Number, required:true, default: 1}, // 1 es porcentaje y 2 es moneda
    discount: {type: Number, required:true},
    start_date: {type:Date,required:true},
    end_date:{ type:Date,required:true},
    start_date_num: {type:Number,required:true},
    end_date_num:{ type:Number,required:true},
    state:{type:Number,default: 1}, //1 es activo y 2 es desactivo
    type_segment:{type:Number,default: 1},//1 es por producto y 2 es por categoria
    products:[{type:Object, required:false}],
    categories:[{type:Object, required:false}],
},{
    timestamps:true,
}); 

const Discount = mongoose.model("discounts",DiscountSchema);
export default Discount;