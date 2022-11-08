import express from 'express';
import { RequestCustom } from '../../../helpers';
import { getQueryFromSearchParams } from '../../middleware/queryFromParams';
import fetchFromDB from '../../middleware/fetchFromDB';
import { collections } from '../../../db/services/db.service';
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

router.get('/autocomplete', getQueryFromSearchParams, async (req, res) => {
    try {
        const search = (req as RequestCustom).searchQueries;
        const result = await collections.products?.aggregate(search.autocomplete).toArray();
        const normalizedResult = result?.map((product) => {
            product.description = product.description?.replace(/<br \/>/g, '\n');
            return product;
        });
        res
            .status(200)
            .json(normalizedResult);
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

export default router;