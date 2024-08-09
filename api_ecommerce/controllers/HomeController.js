import models from '../models'
import resource from '../resources'
import bcrypt from 'bcryptjs'

export default {
    list:async(req,res) => {
        try {

            var TIME_NOW  = req.query.TIME_NOW;

            let Sliders = await models.Slider.find({state:1});

            Sliders = Sliders.map((slider) => {
                return resource.Slider.slider_list(slider);
            })

            let Categories = await models.Categorie.find({state:1});

            Categories = Categories.map((categorie) => {
                return resource.Categorie.categorie_list(categorie);
            })
            
            let CampaingDiscount = await models.Discount.findOne({
                type_campaign: 1,
                start_date_num: {$lte: TIME_NOW},
                end_date_num: {$gte: TIME_NOW},
            });
            
            let BestProducts = await models.Product.find({state: 2}).sort({"createdAt": -1});

            var ObjectBestProducts = [];
            for (const Product of BestProducts) {
                let VARIEDADES = await models.Variedad({product: Product._id});
                let REVIEWS = await models.Review.find({product: Product._id});
                let AVG_REVIEW = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum,item) => sum + item.cantidad,0)/REVIEWS.length) : 0;
                let COUNT_REVIEW = REVIEWS.length;
                let DISCOUNT_EXITS = null;
                if(CampaingDiscount){
                    if(CampaingDiscount.type_segment == 1){//esto es por producto
                        let products_a = [];
                        CampaingDiscount.products.forEach(item => {
                            products_a.push(item._id);
                        })
                        if(products_a.includes(Product._id+"")){
                            DISCOUNT_EXITS = CampaingDiscount;
                        }
                    }else{//esto es por categoria
                        let categories_a = [];
                        CampaingDiscount.categories.forEach(item => {
                            categories_a.push(item._id);
                        })
                        if(categories_a.includes(Product.categorie+"")){
                            DISCOUNT_EXITS = CampaingDiscount;
                        }
                    }
                }
                ObjectBestProducts.push(resource.Product.product_list(Product,VARIEDADES,AVG_REVIEW,COUNT_REVIEW,DISCOUNT_EXITS));
            }

            let OursProducts = await models.Product.find({state: 2}).sort({"createdAt": 1});

            var ObjectOursProducts = [];
            for (const Product of OursProducts) {
                let VARIEDADES = await models.Variedad.find({product: Product._id});
                let REVIEWS = await models.Review.find({product: Product._id});
                let AVG_REVIEW = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum,item) => sum + item.cantidad,0)/REVIEWS.length) : 0;
                let COUNT_REVIEW = REVIEWS.length;
                let DISCOUNT_EXITS = null;
                if(CampaingDiscount){
                    if(CampaingDiscount.type_segment == 1){//por producto
                        let products_a = [];
                        CampaingDiscount.products.forEach(item => {
                            products_a.push(item._id);
                        })
                        if(products_a.includes(Product._id+"")){
                            DISCOUNT_EXITS = CampaingDiscount;
                        }
                    }else{//por categoria
                        let categories_a = [];
                        CampaingDiscount.categories.forEach(item => {
                            categories_a.push(item._id);
                        })
                        if(categories_a.includes(Product.categorie+"")){
                            DISCOUNT_EXITS = CampaingDiscount;
                        }
                    }
                }
                ObjectOursProducts.push(resource.Product.product_list(Product,VARIEDADES,AVG_REVIEW,COUNT_REVIEW,DISCOUNT_EXITS));
            }
        
            let FlashSale = await models.Discount.findOne({
                type_campaign: 2,
                start_date_num: {$lte: TIME_NOW},
                end_date_num: {$gte: TIME_NOW},
            });

            let ProductList = [];
            if(FlashSale){
                for (const product of FlashSale.products) {
                    var ObjecT = await models.Product.findById({_id: product._id});
                    let VARIEDADES = await models.Variedad.find({product: product._id});
                    ProductList.push(resource.Product.product_list(ObjecT,VARIEDADES));
                }
            }
            // console.log(FlashSale);
            res.status(200).json({
                sliders: Sliders,
                categories: Categories,
                best_products: ObjectBestProducts,
                our_products: ObjectOursProducts,
                FlashSale: FlashSale,
                campaign_products: ProductList,
            });
        } catch (error) {
            res.status(500).send({
                message:"OCURRIO ERROR"
            });
            console.log(error);
        }
    },
    show_landing_product:async(req,res) => {
        try {
            let SLUG = req.params.slug;
            let DISCOUNT_ID = req.query._id;
            console.log(DISCOUNT_ID);
            let Product = await models.Product.findOne({slug: SLUG,state: 2});
            
            let VARIEDADES = await models.Variedad.find({product: Product._id});

            let REVIEWS = await models.Review.find({product: Product._id}).populate("user");
            let AVG_REVIEW = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum,item) => sum + item.cantidad,0)/REVIEWS.length) : 0;
            let COUNT_REVIEW = REVIEWS.length;

            let RelatedProducts = await models.Product.find({categorie: Product.categorie,state: 2});
            var ObjectRelatedProducts = [];
            for (const Product of RelatedProducts) {
                let VARIEDADES = await models.Variedad.find({product: Product._id});
                ObjectRelatedProducts.push(resource.Product.product_list(Product,VARIEDADES));
            }
            let SALE_FLASH = null;
            if(DISCOUNT_ID){
                SALE_FLASH = await models.Discount.findById({_id: DISCOUNT_ID});
            }
            res.status(200).json({
                product: resource.Product.product_list(Product,VARIEDADES),
                related_products: ObjectRelatedProducts,
                SALE_FLASH: SALE_FLASH,
                REVIEWS: REVIEWS,
                AVG_REVIEW: AVG_REVIEW,
                COUNT_REVIEW: COUNT_REVIEW,
            })
        } catch (error) {
            res.status(500).send({
                message:"OCURRIO ERROR"
            });
            console.log(error);
        }
    },
    search_product:async(req,res) => {
        try {
            var TIME_NOW  = req.query.TIME_NOW;
            let search_product = req.body.search_product;
            let OursProducts = await models.Product.find({state: 2,title: new RegExp(search_product,'i')}).sort({"createdAt": 1});

            let CampaingDiscount = await models.Discount.findOne({
                type_campaign: 1,
                start_date_num: {$lte: TIME_NOW},// start_date_num >= TIME_NOW
                end_date_num: {$gte: TIME_NOW},// >=
            });

            var Products = [];
            for (const Product of OursProducts) {
                let VARIEDADES = await models.Variedad.find({product: Product._id});
                let REVIEWS = await models.Review.find({product: Product._id});
                let AVG_REVIEW = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum,item) => sum + item.cantidad,0)/REVIEWS.length) : 0;
                let COUNT_REVIEW = REVIEWS.length;
                let DISCOUNT_EXITS = null;
                if(CampaingDiscount){
                    if(CampaingDiscount.type_segment == 1){//por producto
                        let products_a = [];
                        CampaingDiscount.products.forEach(item => {
                            products_a.push(item._id);
                        })
                        if(products_a.includes(Product._id+"")){
                            DISCOUNT_EXITS = CampaingDiscount;
                        }
                    }else{//por categoria
                        let categories_a = [];
                        CampaingDiscount.categories.forEach(item => {
                            categories_a.push(item._id);
                        })
                        if(categories_a.includes(Product.categorie+"")){
                            DISCOUNT_EXITS = CampaingDiscount;
                        }
                    }
                }
                Products.push(resource.Product.product_list(Product,VARIEDADES,AVG_REVIEW,COUNT_REVIEW,DISCOUNT_EXITS));
            }
            res.status(200).json({
                products: Products,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Ocurrio un error",
            });
        }
    },
    profile_client:async(req,res) => {
        try {
            
            let user_id = req.body.user_id;

            let Orders = await models.Sale.find({user: user_id});

            let sale_orders = [];

            for (const order of Orders) {
                let detail_orders = await models.SaleDetail.find({sale: order._id}).populate({
                    path: "product",
                    populate: {
                        path: "categorie"
                    },
                }).populate("variedad");
                let sale_address = await models.SaleAddress.find({sale: order._id});
                let collection_detail_orders = [];
               /* for (const detail_order of detail_orders) {
                    let reviewS = await models.Review.findOne({sale_detail: detail_order._id});
                    collection_detail_orders.push({
                        _id: detail_order._id,
                        product: {
                            _id: detail_order.product._id,
                            title: detail_order.product.title,
                            sku: detail_order.product.sku,
                            slug: detail_order.product.slug,
                            imagen: process.env.URL_BACKEND+'/api/products/uploads/product/'+detail_order.product.portada,//*
                            categorie: detail_order.product.categorie,
                            price_pesos: detail_order.product.price_pesos,
                            price_usd: detail_order.product.price_usd,
                        },
                        type_discount: detail_order.type_discount,
                        discount: detail_order.discount,
                        cantidad: detail_order.cantidad,
                        variedad: detail_order.variedad,
                        code_cupon: detail_order.code_cupon,
                        code_discount: detail_order.code_discount,
                        price_unitario: detail_order.price_unitario,
                        subtotal: detail_order.subtotal,
                        total: detail_order.total,
                        review: reviewS,
                    })
                }*/
                   for (const detail_order of detail_orders) {
                        let reviewS;
                        if (models.Review) {
                            reviewS = await models.Review.findOne({ sale_detail: detail_order._id });
                        } else {
                            console.error('models.Review is undefined');
                        }
                    
                        collection_detail_orders.push({
                            _id: detail_order._id,
                            product: {
                                _id: detail_order.product._id,
                                title: detail_order.product.title,
                                sku: detail_order.product.sku,
                                slug: detail_order.product.slug,
                                imagen: process.env.URL_BACKEND+'/api/products/uploads/product/'+detail_order.product.portada,//*
                                categorie: detail_order.product.categorie,
                                price_pesos: detail_order.product.price_pesos,
                                price_usd: detail_order.product.price_usd,
                            },
                            type_discount: detail_order.type_discount,
                            discount: detail_order.discount,
                            cantidad: detail_order.cantidad,
                            variedad: detail_order.variedad,
                            code_cupon: detail_order.code_cupon,
                            code_discount: detail_order.code_discount,
                            price_unitario: detail_order.price_unitario,
                            subtotal: detail_order.subtotal,
                            total: detail_order.total,
                            review: reviewS,
                        });
                    }
                    
                sale_orders.push({
                    sale: order,
                    sale_details: collection_detail_orders,
                    sale_address: sale_address,
                });
            }
            let ADDRESS_CLIENT = await models.AddressClient.find({user: user_id}).sort({'createdAt': -1});
            res.status(200).json({
                sale_orders: sale_orders,
                address_client: ADDRESS_CLIENT,
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Ocurrio un error",
            });
        }
    },
    update_client: async(req,res) => {
        try {
            if(req.files){
                var img_path = req.files.avatar.path;
                var name = img_path.split('\\');
                var avatar_name = name[2];
                console.log(avatar_name)
            }
            if(req.body.password){
                req.body.password = await bcrypt.hash(req.body.password,10);
            }
            await models.User.findByIdAndUpdate({_id: req.body._id},req.body);
            let User = await models.User.findOne({_id: req.body._id});
            res.status(200).json({
                message: "SU INFORMACIÓN SE HA GUARDADO CORRECTAMENTE",
                user: {
                    name: User.name,
                    surname: User.surname,
                    email:User.email,
                    _id:User._id,
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Ocurrio un error",
            });
        }
    },
    config_initial:async(req,res) => {
        try {
            let categories = await models.Categorie.find({state: 1});
            let variedades = await models.Variedad.find({});
            res.status(200).json({
                categories: categories,
                variedades: variedades,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Ocurrio un error",
            });
        }
    },
    filter_products:async(req,res) => {
        try {
            var TIME_NOW  = req.query.TIME_NOW;
            let search_product = req.body.search_product;

            let categories_selecteds = req.body.categories_selecteds;
            let is_discount = req.body.is_discount;
            let variedad_selected = req.body.variedad_selected;
            let price_min = req.body.price_min;
            let price_max = req.body.price_max;

            let filter = [
                {state: 2},
            ];

            var categories_s = [];
            var products_s = [];
            // {state: 2,title: new RegExp(search_product,'i')}
            if(categories_selecteds.length > 0){
                categories_selecteds.forEach((categorie) => {
                    categories_s.push(categorie);
                })
                // filter.push({
                //     categorie: {$in: categories_selecteds},
                // })
            }
            let CampaingDiscount = await models.Discount.findOne({
                type_campaign: 1,
                start_date_num: {$lte: TIME_NOW},// start_date_num >= TIME_NOW
                end_date_num: {$gte: TIME_NOW},// >=
            });
            
            if(is_discount == 2){
                if(CampaingDiscount.type_segment == 1){
                    CampaingDiscount.products.forEach(item => {
                        products_s.push(item._id);
                    })
                }else{
                    CampaingDiscount.categories.forEach(item => {
                        categories_s.push(item._id);
                    })
                }
            }
            if(variedad_selected){
                let VAR = await models.Variedad.findById({_id: variedad_selected._id});
                if(VAR){
                    products_s.push(VAR.product);
                }
            }
            if(categories_s.length > 0){
                filter.push({
                    categorie: {$in: categories_s},
                });
            }
            if(products_s.length > 0){
                filter.push({
                    _id: {$in: products_s}
                });
            }
            if(price_min > 0 && price_max > 0){
                filter.push({
                    price_usd: {$gte: price_min, $lte: price_max},
                });
            }
            let OursProducts = await models.Product.find({$and: filter}).sort({"createdAt": 1});

            
            var Products = [];
            for (const Product of OursProducts) {
                let VARIEDADES = await models.Variedad.find({product: Product._id});
                let REVIEWS = await models.Review.find({product: Product._id});
                let AVG_REVIEW = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum,item) => sum + item.cantidad,0)/REVIEWS.length) : 0;
                let COUNT_REVIEW = REVIEWS.length;
                let DISCOUNT_EXITS = null;
                if(CampaingDiscount){
                    if(CampaingDiscount.type_segment == 1){//por producto
                        let products_a = [];
                        CampaingDiscount.products.forEach(item => {
                            products_a.push(item._id);
                        })
                        if(products_a.includes(Product._id+"")){
                            DISCOUNT_EXITS = CampaingDiscount;
                        }
                    }else{//por categoria
                        let categories_a = [];
                        CampaingDiscount.categories.forEach(item => {
                            categories_a.push(item._id);
                        })
                        if(categories_a.includes(Product.categorie+"")){
                            DISCOUNT_EXITS = CampaingDiscount;
                        }
                    }
                }
                Products.push(resource.Product.product_list(Product,VARIEDADES,AVG_REVIEW,COUNT_REVIEW,DISCOUNT_EXITS));
            }
            res.status(200).json({
                products: Products,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Ocurrio un error",
            });
        }
    },
}