import models from '../models'
import resource from '../resources'
import path from 'path'
import fs from 'fs'

export default {
    register: async(req,res) => {
        try {
            if(req.files){
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                //console.log(portada_name)
               req.body.imagen = portada_name;
            }
            const slider = await models.Slider.create(req.body);
            res.status(200).json(slider);

        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    },
    update: async(req,res) => {
        try {
            if(req.files && req.files.portada){
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                //console.log(portada_name)
                req.body.imagen = portada_name;
            }
            await models.Slider.findByIdAndUpdate({_id: req.body._id}, req.body);

            let SliderT = await models.Slider.findOne({_id: req.body._id});
            res.status(200).json({
                message: "EL SLIDER HA SIDO MODIFICADO CORRECTAMENTE",
                slider: resource.Slider.slider_list(SliderT),
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }

    },
    list: async(req,res) => {
        try {
            var search = req.query.search;
            let Sliders = await models.Slider.find({
                $or:[
                    {'title': new RegExp(search, "i")},
                ]
            }).sort({'createdAt': -1});

            Sliders = Sliders.map((slider) => {
                return resource.Slider.slider_list(slider);
            })

            res.status(200).json({
                sliders: Sliders
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    },
    obtener_imagen : async(req,res) => {
        try {
            var img = req.params['img'];

            fs.stat('./uploads/slider/'+img, function(err){
                if(!err){
                    let path_img = './uploads/slider/'+img;
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
    remove: async(req,res) => {
        try {
            await models.Slider.findOneAndDelete({_id: req.query._id});
            res.status(200).json({
                message: "EL SLIDER SE ELIMINO CORRECTAMENTE",
            });
           
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error);
        }
    }
}