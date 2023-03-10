import express from 'express';
import bodyParser from 'body-parser';
import createError from 'http-errors';

import productRouter from './api/products';
import userRouter from './api/user';
import cartRouter from './api/cart';
import favoritsRouter from './api/favorits';
import ordersRouter from './api/order';
import subscribersRouter from './api/subscribers';
import addressRouter from './api/address';
import nameRouter from './api/user_name';


const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/products', productRouter);
router.use('/user', userRouter);
router.use('/carts', cartRouter);
router.use('/favorits', favoritsRouter);
router.use('/orders', ordersRouter);
router.use('/subscribe', subscribersRouter);
router.use('/name', nameRouter);
router.use('/address', addressRouter);


router.use((error: Error | createError.HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const status = createError.isHttpError(error) ? error.statusCode : 500;
    const message = (createError.isHttpError(error) && status !== 500) ? error.message : 'Непредвиденная ошибка';
    res
        .status(200)
        .json({ error: { message: message, status } });
})


export default router;