import mongoose,{Schema} from "mongoose";

const ProductSchema = new Schema({
    title: {type:String,required:true,maxlength:250},
    slug: {type:String,required:true,maxlength:1000},
    sku: {type:String,required:true},
    categorie: {type:Schema.ObjectId,ref:'categorie',required:true},
    price_pesos: {type:Number,required:true},
    price_usd: {type:Number,required:true},
    portada: {type:String,required:true},
    galerias: [{type:Object,required:false}],
    state: {type:Number,default:1},//1 es de prueba y 2 es publico y 3 es anulado
    stock: {type:Number,default:0},
    description: {type:String,required:true},
    resumen: {type:String,required:true},
    tags: {type:String,required:true},
    type_inventario: {type:Number,default:1},
},{
    timestamps:true,   
});

const Product = mongoose.model('product',ProductSchema);
export default Product;