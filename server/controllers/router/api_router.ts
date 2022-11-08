import express from 'express';
import bodyParser from 'body-parser';

import productRouter from './api/products';
import userRouter from './api/user';
import cartRouter from './api/cart';
import favoritsRouter from './api/favorits';
import ordersRouter from './api/order';


const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/products', productRouter);
router.use('/user', userRouter);
router.use('/carts', cartRouter);
router.use('/favorits', favoritsRouter);
router.use('/orders', ordersRouter);

export default router;