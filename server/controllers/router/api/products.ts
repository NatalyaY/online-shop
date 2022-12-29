import express from 'express';
import { RequestCustom } from '../../../helpers';
import getQueryFromSearchParams, { getQuery } from '../../middleware/queryFromParams';
import fetchFromDB from '../../middleware/fetchFromDB';
import { customProducts } from './requestTypes';

const router = express.Router();

const sendResults = (req: express.Request, res: express.Response) => {
    const { productsQty, ...rest } = (req as RequestCustom).fetchedData;
    const result = {
        params: (req as RequestCustom).reqParams,
        qty: productsQty,
        ...rest
    };
    res
        .status(200)
        .json(result);
};

router.get('/', getQueryFromSearchParams, fetchFromDB({ coll: ['products'] }), sendResults);

router.get('/all', fetchFromDB({ limit: false, coll: ['products'], productOptions: false }), (req, res) => {
    const data = (req as RequestCustom).fetchedData;
    const result = {
        products: data.products,
    };
    res
        .status(200)
        .json(result);
});

router.get('/autocomplete', getQueryFromSearchParams, fetchFromDB({ coll: ['products'], autocomplete: true }), (req, res) => {
    const data = (req as RequestCustom).fetchedData;
    res
        .status(200)
        .json({ products: data.products, hints: data.hints });
});

router.post('/custom/:limit?',
    (req: customProducts, res, next) => getQuery(req.body, req, next),
    (req, res, next) => fetchFromDB({ limit: req.params.limit ? +req.params.limit : false, coll: ['products'], productOptions: false })(req, res, next),
    sendResults);

export default router;