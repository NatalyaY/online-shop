import express from 'express';
import { params, query, RequestCustom } from '../../helpers';
import { ObjectId } from 'mongodb';

const paramsMap = {
    category: 'categoryId' as 'categoryId',
    brand: 'brand' as 'brand',
    price: 'price' as 'price',
    inStock: 'amount' as 'amount',
    p: 'page' as 'page',
    onpage: 'onpage' as 'onpage',
    sorting: 'sorting' as 'sorting',
};

export const getQuery = (params: params, req: express.Request, next: express.NextFunction) => {
    (req as RequestCustom).reqParams = params;

    if (params._id) {
        const query = typeof params._id == 'string' ?
            { _id: new ObjectId(params._id) } :
            { _id: { $in: params._id.map(id => new ObjectId(id)) } };
        (req as RequestCustom).queryBD = query;
        return next();
    };

    if (params.s) {
        const divider = '((\\s+|$|\\.)|(\\:\\s+))';
        const start = `([A-ZА-Я][а-яa-z]+${divider}(?!\\-))`;
        const capital = `([A-ZА-Я][A-ZА-Яа-яa-z]*${divider})`;
        const small = `([a-zа-я][A-zА-я]*${divider})`;
        const any = `([A-zА-я]+${divider})`;
        const dashed = `([A-zА-я\\d]+\\s*\\-\\s*[A-zА-я]{2,}${divider})`;
        const reg = `^(${start}|${dashed})${dashed}*(${capital}${any}*)*(${small}+)*${dashed}*`;

        const results =
            [{
                $search: {
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: params.s,
                                    path: 'name',
                                    score: {
                                        boost: {
                                            value: 2
                                        }
                                    }
                                },
                            },
                            {
                                text: {
                                    query: params.s,
                                    path: 'description',
                                },
                            },
                            {
                                text: {
                                    query: params.s,
                                    path: 'brand',
                                    score: {
                                        boost: {
                                            value: 2
                                        }
                                    }
                                },
                            }
                        ],
                    }
                },
            },
            ];
        const autocompleteHints =
            [
                {
                    '$search': {
                        'compound': {
                            'should': [
                                {
                                    'autocomplete': {
                                        'query': params.s,
                                        'path': 'name'
                                    }
                                }
                            ],
                        },
                        'highlight': {
                            'path': 'name'
                        }
                    }
                },
                {
                    '$project': {
                        'highlights': {
                            '$first': {
                                '$meta': 'searchHighlights'
                            }
                        }
                    }
                },
                {
                    '$project': {
                        'hits': {
                            '$filter': {
                                'input': '$highlights.texts',
                                'cond': {
                                    '$eq': [
                                        '$$item.type', 'hit'
                                    ]
                                },
                                'as': 'item'
                            }
                        }
                    }
                },
                {
                    '$project': {
                        'texts': {
                            '$first': {
                                '$map': {
                                    'input': '$hits',
                                    'as': 'obj',
                                    'in': '$$obj.value'
                                }
                            }
                        }
                    }
                },
                {
                    '$project': {
                        'texts': { $regexFind: { input: "$texts", regex: new RegExp(reg) } }
                    }
                },
                {
                    '$project': {
                        'texts': '$texts.match'
                    }
                },
                {
                    '$project': {
                        'texts': { $replaceAll: { input: "$texts", find: " - ", replacement: " " } }
                    }
                },
                {
                    '$project': {
                        'texts': { $replaceAll: { input: "$texts", find: "-", replacement: " " } }
                    }
                },
                {
                    '$project': {
                        'texts': { $replaceAll: { input: "$texts", find: ":", replacement: " " } }
                    }
                },
                {
                    '$project': {
                        'texts': { $replaceAll: { input: "$texts", find: ".", replacement: " " } }
                    }
                },
                {
                    '$project': {
                        'texts': { $rtrim: { input: "$texts" } },
                    }
                },
                {
                    '$group': {
                        '_id': '$texts',
                        'count': {
                            '$sum': 1
                        }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 5
                }
            ]
        const resultsQty = [...results, { $count: "searchResults" }];
        (req as RequestCustom).searchQueries = { results, resultsQty, autocompleteHints };
    };

    const { price, inStock, brand, ...rest } = params;
    // prepare only known params
    const query: query = Object.fromEntries(
        Object.entries(rest)
            .map(([k, v]) => [paramsMap[k as keyof typeof paramsMap], k == 'p' || k == 'onpage' ? +v : v])
            .filter(e => e[0] !== undefined)
    );

    if (price && price.split(';').length == 2) {
        const [minPrice, maxPrice] = price.split(';');
        query['salePrice'] = { $lte: +maxPrice, $gte: +minPrice };
    };

    if (inStock) {
        query[paramsMap['inStock']] = { $gt: 0 };
    };

    if (brand) {
        query[paramsMap['brand']] = { $in: brand.split(';') };
    };

    (req as RequestCustom).queryBD = query;

    next();
};

const parseParams = (req: express.Request) => {
    const PROD_REG = /prod-(?<product>([^\/]+?))-(.*)\/?/i;
    const CAT_REG = /cat-(?<category>([^\/]+?))-(.*)\/?/i;
    const BRAND_REG = /(\/brands\/(?<brand>([^\/]+?)))(\/(.*))?$/i;

    if (req.url.match(PROD_REG)) {
        const prod_id = req.url.match(PROD_REG)!.groups!.product;
        return { _id: prod_id };
    };

    const [, s] = req.url.split('?') || req.headers.referer?.split('?');
    const path = req.headers.referer || req.url;

    const searchParams: params = s ? Object.fromEntries(new URLSearchParams(s).entries()) : {};

    const category = path.match(CAT_REG)?.groups?.category || req.query.category as string;
    const brand = path.match(BRAND_REG)?.groups?.brand || req.query.brand as string;

    return { ...searchParams, ...(category && { category }), ...(brand && { brand }) };
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