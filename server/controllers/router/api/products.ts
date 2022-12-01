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
            params: {
                params: (req as RequestCustom).reqParams,
                qty: data.productsQty,
                productsBrands: data.productsBrands,
                productsCategories: data.productsCategories,
                minPrice: data.minPrice,
                maxPrice: data.maxPrice
            },
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

router.post('/custom', (req, res, next) => getQuery(req.body, req, next), fetchFromDB({ coll: ['products'] }), async (req, res) => {
    try {
        const data = (req as RequestCustom).fetchedData;
        const result = {
            products: data.products,
            qty: data.productsQty,
            params: {
                params: (req as RequestCustom).reqParams,
                qty: data.productsQty,
                productsBrands: data.productsBrands,
                productsCategories: data.productsCategories,
                minPrice: data.minPrice,
                maxPrice: data.maxPrice
            },
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