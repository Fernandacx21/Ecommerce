import models from "../models";

export default {
    register:async(req,res) => {
        try {
            const address_client = await models.AddressClient.create(req.body);
            res.status(200).json({
                message: "LA DIRECCIÓN DEL CLIENTE SE REGISTRO CORRECTAMENTE",
                address_client: address_client,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "HUBO UN ERROR",
            });
        }
    },
    update:async(req,res) => {
        try {
            let data = req.body;
            await models.AddressClient.findByIdAndUpdate({_id: req.body._id},data);
            let AddressClient = await models.AddressClient.findById({_id: req.body._id});
            res.status(200).json({
                message: "LA DIRECCIÓN DEL CLIENTE SE EDITO CORRECTAMENTE",
                address_client: AddressClient,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "HUBO UN ERROR",
            });
        }
    },
    list:async(req,res) => {
        try {
            let ADDRESS_CLIENT = await models.AddressClient.find({user: req.query.user_id}).sort({'createdAt': -1});
            res.status(200).json({
                address_client: ADDRESS_CLIENT
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "HUBO UN ERROR",
            });
        }
    },
    remove:async(req,res) => {
        try {
            await models.AddressClient.findByIdAndDelete({_id: req.params._id});
            res.status(200).json({
                message: "LA DIRECCIÓN DEL CLIENTE SE ELIMINO CORRECTAMENTE",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "HUBO UN ERROR",
            });
        }
    },
}