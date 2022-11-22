import express from 'express';
import { RequestCustom } from '../../../helpers';
import getQueryFromSearchParams, { getQuery } from '../../middleware/queryFromParams';
import fetchFromDB from '../../middleware/fetchFromDB';
import createError from 'http-errors';

const router = express.Router();

router.get('/', getQueryFromSearchParams, fetchFromDB({ coll: ['products'] }), async (req, res) => {
    try {
        const data = (req as RequestCustom).fetchedData;
        const result = {
            products: data.products,
            qty: data.productsQty,
        };
        res
            .status(200)
            .json(result);
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
});

router.get('/all', fetchFromDB({ limit: false, coll: ['products'] }), async (req, res) => {
    try {
        const data = (req as RequestCustom).fetchedData;
        const result = {
            products: data.products,
        };
        res
            .status(200)
            .json(result);
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
});

router.get('/autocomplete', getQueryFromSearchParams, fetchFromDB({ coll: ['products'], autocomplete: true }), async (req, res) => {
    try {
        const data = (req as RequestCustom).fetchedData;
        res
            .status(200)
            .json(data.products);
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
});

router.get('/prod-:product', getQueryFromSearchParams, fetchFromDB({ limit: 1, coll: ['products'] }), async (req, res) => {
    try {
        const data = (req as RequestCustom).fetchedData;
        res
            .status(200)
            .json(data.products[0] || {});
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
});

router.post('/custom', async (req, res, next) => {
    try {
        await getQuery(req.body, req, res, next);
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
}, fetchFromDB({ coll: ['products'] }),  async (req, res) => {
    try {
        const data = (req as RequestCustom).fetchedData;
        const result = {
            products: data.products,
            qty: data.productsQty,
        };
        res
            .status(200)
            .json(result);
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
});

export default router;