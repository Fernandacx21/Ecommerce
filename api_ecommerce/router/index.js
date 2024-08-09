import routerx from 'express-promise-router'
import User from './User'
import Categorie from './Categorie'
import Product from './Product'
import Slider from './Slider'
import Cupone from './Cupone'
import Discount from './Discount'
import Home from './Home'
import Cart from './Cart'
import AddressClient from './AddressClient'
import Sale from './Sale'
import Review from './Review'

const router = routerx();
router.use('/users',User);
router.use('/categories',Categorie);
router.use('/products',Product);
router.use('/sliders',Slider);
router.use('/cupones',Cupone);
router.use('/discount', Discount);
router.use('/home', Home);
router.use('/cart', Cart);
router.use('/address_client', AddressClient);
router.use('/sale',Sale);
router.use('/review',Review);

export default router;