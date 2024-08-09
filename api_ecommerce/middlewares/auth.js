import token from '../services/token'

export default{
    verifyEcommerce: async(req,res,next) => {
        if(!req.headers.token){
            res.status(404).send({
                message: 'NO SE ENVIO EL TOKEN'
            });
        }
        const response = await token.decode(req.headers.token);
        if(response){
            if(response.rol == "cliente" || response.rol == "admin"){
                next();
            }else{
                res.status(403).send({
                    message: 'NO ESTA PERMITIDO EL ACCESO' 
                });
            }
        }else{
            res.status(403).send({
                message: 'EL TOKEN NO ES VALIDO' 
            });
        }
    },
    verifyAdmin: async(req,res,next) => {
        if(!req.headers.token){
            res.status(404).send({
                message: 'NO SE ENVIO EL TOKEN'
            });
        }
        const response = await token.decode(req.headers.token);
        if(response){
            if(response.rol == "admin"){
                next();
            }else{
                res.status(403).send({
                    message: 'NO ESTA PERMITIDO EL ACCESO' 
                });
            }
        }else{
            res.status(403).send({
                message: 'EL TOKEN NO ES VALIDO' 
            });
        }
    }
}