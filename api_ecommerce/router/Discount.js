import routerx from 'express-promise-router'
import discountController from '../controllers/DiscountController'
import auth from '../middlewares/auth'

const router = routerx();

router.post("/register",auth.verifyAdmin,discountController.register);
router.put("/update",auth.verifyAdmin,discountController.update);
router.get("/list",auth.verifyAdmin,discountController.list);
router.get("/config",auth.verifyAdmin,discountController.config);
router.get("/show",auth.verifyAdmin,discountController.show);
router.delete("/delete",auth.verifyAdmin,discountController.delete);

export default router;