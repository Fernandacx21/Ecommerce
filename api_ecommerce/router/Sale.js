import routerx from 'express-promise-router'
import SaleController from '../controllers/SaleController'
import auth from '../middlewares/auth'

const router = routerx();
// http://localhost:3000/api/users/register

router.post("/register",auth.verifyEcommerce,SaleController.register);
// router.get("/send_email/:id",SaleController.send_email);
export default router;