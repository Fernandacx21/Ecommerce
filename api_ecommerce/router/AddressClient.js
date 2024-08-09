import routerx from 'express-promise-router'
import AddressClientController from '../controllers/AddressClientController'
import auth from '../middlewares/auth'

const router = routerx();
// http://localhost:3000/api/users/register

router.post("/register",auth.verifyEcommerce,AddressClientController.register);
router.put("/update",auth.verifyEcommerce,AddressClientController.update);
router.get("/list",auth.verifyEcommerce,AddressClientController.list);
router.delete("/delete/:id",auth.verifyEcommerce,AddressClientController.remove);

export default router;