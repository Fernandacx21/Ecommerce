import models from "../models";

export default {
    register:async(req,res) => {
        try {
            let review = await models.Review.create(req.body);

            res.status(200).json({
                message: "LA RESEÑA HA SIDO REGISTRADA CORRECTAMENTE",
                review: review,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message:"OCURRIO UN ERROR",
            });
        }
    },
    update:async(req,res) => {
        try {
            await models.Review.findByIdAndUpdate({_id: req.body._id},req.body);

            let reviewD = await models.Review.findById({_id: req.body._id});
            res.status(200).json({
                message: "LA RESEÑA HA MODIFICADO CORRECTAMENTE",
                review: reviewD
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message:"OCURRIO UN ERROR",
            });
        }
    },
}