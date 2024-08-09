import routerx from 'express-promise-router'
import categorieController from '../controllers/CategorieController'
import auth from '../middlewares/auth'

import multiparty from 'connect-multiparty'
var path = multiparty({uploadDir: './uploads/categorie'})
const router = routerx();
//EJEMPLO DE RUTA   
//http://localhost:3000/api/user/register

router.post("/register",[auth.verifyAdmin,path],categorieController.register);
router.put("/update",[auth.verifyAdmin,path],categorieController.update);
router.get("/list",auth.verifyAdmin,categorieController.list);
router.delete("/delete",auth.verifyAdmin,categorieController.remove);

router.get("/uploads/categorie/:img",categorieController.obtener_imagen);

export default router;