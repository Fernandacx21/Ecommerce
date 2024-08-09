import models from '../models'
import resources from '../resources';
import fs from 'fs'
import path from 'path'

export default {
    register: async(req,res) => {
        try {
            let data = req.body;
            
            let valid_Product = await models.Product.findOne({title: data.title});

            if(valid_Product){
                res.status(200).json({
                    code: 403,
                    message: 'EL PRODUCTO YA EXISTE'
                });
                return;
            }

            data.slug = data.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            if(req.files){
                var img_path = req.files.imagen.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                data.portada = portada_name;
            }

            let product = await models.Product.create(data);

            res.status(200).json({
                message: "EL PRODUCTO SE REGISTRO CON EXITO"
            });

        } catch (error) {
            res.status(500).send({
                message: "OCUURRIO UN PROBLEMA"
            });
        }
    },
    update:async(req,res) => {
        try {
            let data = req.body;
            
            let valid_Product = await models.Product.findOne({title: data.title, _id: {$ne : data._id}});

            if(valid_Product){
                res.status(200).json({
                    code: 403,
                    message: 'EL PRODUCTO YA EXISTE'
                });
                return;
            }

            data.slug = data.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            if(req.files && req.files.imagen){
                var img_path = req.files.imagen.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                data.portada = portada_name;
            }

            await models.Product.findByIdAndUpdate({_id:data._id},data);

            res.status(200).json({
                message: "EL PRODUCTO SE REGISTRO SE ACTUALIZO CON EXITO"
            });

        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
        }
    },
    list: async (req, res) => {
        try {
            let filter = {};
            
            if (req.query.search) {
                filter["title"] = new RegExp(req.query.search, 'i');
            }
            
            if (req.query.categorie) {
                filter["categorie"] = req.query.categorie;
            }
    
            let products = await models.Product.find(filter).populate('categorie');
    
            products = products.map(product => {
                return resources.Product.product_list(product);
            });
    
            res.status(200).json({
                products: products,
            });
        } catch (error) {
            res.status(500).send({
                message: "Ocurrió un problema al procesar la solicitud",
                error: error.message
            });
        }
    },
    remove:async(req,res) => {
        try {
            let _id = req.query._id;
            await models.Product.findByIdAndDelete({_id: _id});

            res.status(200).json({
                message: "EL PRODUCTO SE ELIMINO CORRECTAMENTE"
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
        }
    },
    obtener_imagen:async(req,res) => {
        try {
            var img = req.params['img'];

            fs.stat('./uploads/product/'+img, function(err){
                if(!err){
                    let path_img = './uploads/product/'+img;
                    res.status(200).sendFile(path.resolve(path_img));
                }else{
                    let path_img = './uploads/default.jpg';
                    res.status(200).sendFile(path.resolve(path_img));
                }
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    },
    show: async(req,res) => {
        try {
            var product_id = req.params.id;
            let PRODUCT = await models.Product.findById({_id: product_id}).populate("categorie");

            let VARIEDADES = await models.Variedad.find({product: product_id});
            res.status(200).json({
                product: resources.Product.product_list(PRODUCT,VARIEDADES),
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    },
    register_imagen:async(req,res) => {
        try {
            var img_path = req.files.imagen.path;
            var name = img_path.split('\\');
            var imagen_name = name[2];
            
            let product = await models.Product.findByIdAndUpdate({_id: req.body._id},{
                $push: {
                    galerias: {
                        imagen: imagen_name,
                        _id: req.body.__id
                    }
                }
            })
            res.status(200).json({
                message: "LA IMAGEN SE SUBIO PERFECTAMENTE",
                imagen: {
                    imagen: 'http://localhost:3000'+'/api/products/uploads/product/'+imagen_name,
                    _id: req.body.__id
                }
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
        }
    },
    remove_imagen:async(req,res) => {
        try {
            await models.Product.findByIdAndUpdate({_id: req.body._id},{
                $pull: {
                    galerias: {
                        _id: req.body.__id
                    }
                }
            })
            res.status(200).json({
                message: "LA IMAGEN SE ELIMINO PERFECTAMENTE",
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
        }
    },
}