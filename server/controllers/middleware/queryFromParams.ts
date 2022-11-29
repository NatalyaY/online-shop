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
    let query: query = Object.fromEntries(Object.entries(rest).map(([k, v]) => [searchParams[k as keyof typeof searchParams], v]));

    if (price && ('' + price).split(';').length == 2) {
        const [minPrice, maxPrice] = price.split(';');
        query[searchParams['price']] = { $gt: +minPrice, $lt: +maxPrice[1] };
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
        //     const autocomplete =
        //         [
        //             {
        //                 $search: {

        //                     compound: {
        //                         should: [
        //                             {
        //                                 autocomplete: {
        //                                     query: search.s,
        //                                     path: 'name',
        //                                 },
        //                             },
        //                             {
        //                                 autocomplete: {
        //                                     query: search.s,
        //                                     path: 'description',
        //                                 },
        //                             },
        //                             {
        //                                 autocomplete: {
        //                                     query: search.s,
        //                                     path: 'brand',
        //                                 },
        //                             }
        //                         ],
        //                         must: [
        //                             {
        //                                 range: {
        //                                     path: "amount",
        //                                     "gt": 0,
        //                                 },
        //                             }
        //                         ]
        //                     },
        //                 },
        //             },
        //             { $limit: 5 },
        //         ];
        //     const fullresults =
        //         [
        //             {
        //                 $search: {
        //                     compound: {
        //                         should: [
        //                             {
        //                                 autocomplete: {
        //                                     query: search.s,
        //                                     path: 'name',
        //                                 },
        //                             },
        //                             {
        //                                 autocomplete: {
        //                                     query: search.s,
        //                                     path: 'description',
        //                                 },
        //                             },
        //                             {
        //                                 autocomplete: {
        //                                     query: search.s,
        //                                     path: 'brand',
        //                                 },
        //                             }
        //                         ],
        //                     },
        //                 },
        //             },
        //         ];
        //     const ResultsQty =
        //         [
        //             {
        //                 $search: {
        //                     compound: {
        //                         should: [
        //                             {
        //                                 autocomplete: {
        //                                     query: search.s,
        //                                     path: 'name',
        //                                 },
        //                             },
        //                             {
        //                                 autocomplete: {
        //                                     query: search.s,
        //                                     path: 'description',
        //                                 },
        //                             },
        //                             {
        //                                 autocomplete: {
        //                                     query: search.s,
        //                                     path: 'brand',
        //                                 },
        //                             }
        //                         ],
        //                     },
        //                 },
        //             },
        //             {
        //                 $count: "searchResults"
        //             }
        //         ];
        //     (req as RequestCustom).searchQueries = { autocomplete, fullresults, ResultsQty };
        // } else {
        //     const query = Object.keys(search).reduce((acc, cur) => {
        //         try {
        //             const key = cur as keyof typeof searchParams;
        //             const productProp = searchParams[key];
        //             if (productProp) {
        //                 let value = search[cur];
        //                 if (('' + value).split(';').length == 2 && cur == 'price') {
        //                     acc[productProp] = { $gt: +('' + value).split(';')[0], $lt: +('' + value).split(';')[1] };
        //                 } else if (cur == 'availability') {
        //                     if (search[cur]) {
        //                         acc[productProp] = { $gt: 0 };
        //                     };
        //                 } else if (cur == 'category') {
        //                     acc[productProp] = { $in: categoryIds }
        //                 } else {
        //                     acc[productProp] = search[cur] as keyof typeof search;
        //                 };
        //             };
        //             return acc;
        //         } catch (error) {
        //             console.log(error);
        //             return acc;
        //         };
        //     }, {} as RequestCustom["queryBD"]);
        //     (req as RequestCustom).queryBD = query;
        // };
        // next();
    } catch (error) {
        console.log(req.url);
        console.log(error);
    }
};