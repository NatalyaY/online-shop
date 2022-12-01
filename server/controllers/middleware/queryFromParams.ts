import express from 'express';
import { params, query, RequestCustom } from '../../helpers';
import { ObjectId } from 'mongodb';

const searchParams = {
    category: 'categoryId' as 'categoryId',
    brand: 'brand' as 'brand',
    price: 'price' as 'price',
    availability: 'amount' as 'amount',
    p: 'page' as 'page',
    onpage: 'onpage' as 'onpage',
    sorting: 'sorting' as 'sorting',
};

export const getQuery = (params: params, req: express.Request, next: express.NextFunction) => {
    (req as RequestCustom).reqParams = params;

    if (params._id) {
        const query = typeof params._id == 'string' ? { _id: new ObjectId(params._id) } : { _id: { $in: params._id.map(id => new ObjectId(id)) } };
        (req as RequestCustom).queryBD = query;
        return next();
    };

    if (params.s) {
        const results =
            [
                {
                    $search: {
                        compound: {
                            should: [
                                {
                                    autocomplete: {
                                        query: params.s,
                                        path: 'name',
                                    },
                                },
                                {
                                    autocomplete: {
                                        query: params.s,
                                        path: 'description',
                                    },
                                },
                                {
                                    autocomplete: {
                                        query: params.s,
                                        path: 'brand',
                                    },
                                }
                            ],
                            mustNot: [
                                {
                                    range: {
                                        path: "amount",
                                        "lt": 1,
                                    },
                                }
                            ]
                        },
                    },
                },
            ];
        const resultsQty = [...results, { $count: "searchResults" }];
        (req as RequestCustom).searchQueries = { results, resultsQty };
        return next();
    };

    const { price, availability, ...rest } = params;
    let query: query = Object.fromEntries(Object.entries(rest).map(([k, v]) => [searchParams[k as keyof typeof searchParams], k == 'p' || k == 'onpage' ? +v : v]).filter(e => e[0] !== undefined));

    if (price && ('' + price).split(';').length == 2) {
        const [minPrice, maxPrice] = price.split(';');
        query['$or'] = [{ salePrice: { $lte: +maxPrice, $gte: +minPrice } }, { price: { $lte: +maxPrice, $gte: +minPrice } }]
    };

    if (availability) {
        query[searchParams['availability']] = { $gt: 0 };
    };

    (req as RequestCustom).queryBD = query;

    next();
};

const parseParams = (req: express.Request) => {
    const PROD_REG = /prod-(?<product>([^\/]+?))-(.*)\/?/i;
    const CAT_REG = /cat-(?<category>([^\/]+?))-(.*)\/?/i;
    const BRAND_REG = /(\/brands\/(?<brand>([^\/]+?)))([\/](.*))?$/i;

    if (req.url.match(PROD_REG)) {
        const prod_id = req.url.match(PROD_REG)!.groups!.product;
        return { _id: prod_id };
    };

    const s = req.url.split('?')[1] || req.headers.referer?.split('?')[1];
    const path = req.headers.referer || req.url;

    const search: params = s ? Object.fromEntries(s.split('&').map(str => {
        const [k, v] = str.split('=');
        const value = k == 'onpage' || k == 'p' ? +decodeURI(v) : decodeURI(v);
        return [k, value]
    })) : {};

    const category = path.match(CAT_REG)?.groups?.category || req.query.category as string;
    const brand = path.match(BRAND_REG)?.groups?.brand || req.query.brand as string;

    if (category) {
        search.category = category;
    };
    if (brand) search.brand = brand;
    return search;
};

export default function getQueryFromSearchParams(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const params = parseParams(req);
        getQuery(params, req, next);
    } catch (error) {
        console.log(req.url);
        console.log(error);
    }
};