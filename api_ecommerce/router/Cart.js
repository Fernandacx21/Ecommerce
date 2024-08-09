import routerx from 'express-promise-router'
import cartController from '../controllers/CartController'
import auth from '../middlewares/auth'

const router = routerx();

router.get("/list",auth.verifyEcommerce,cartController.list);
router.post("/register",auth.verifyEcommerce,cartController.register);
router.put("/update",auth.verifyEcommerce,cartController.update);
router.delete("/delete/:id",auth.verifyEcommerce,cartController.delete);
router.post("/aplicar_cupon",auth.verifyEcommerce,cartController.applyCupon);

export default router;