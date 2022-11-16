import express from 'express';
import { RequestCustom } from '../../helpers';
import { ObjectId } from 'mongodb';
import Category from './../../db/models/category';
import { collections } from './../../db/services/db.service';
import { getSubcategories } from '../../../src/common/hooks/useCategories';

export type categoryWithSub = Category & {
    subcategories?: categoryWithSub[];
};

const searchParams = {
    category: 'categoryId',
    brand: 'brand',
    price: 'price',
    _id: '_id',
    availability: 'amount',
    p: 'page',
    onpage: 'onpage',
    sorting: 'sorting',
};

const getCategoriesIds = async (id: Category['UUID']) => {
    const categories = await collections.categories.find().toArray();
    const getIds = (cat: categoryWithSub) => {
        ids.push(cat.UUID);
        if (cat.subcategories) {
            cat.subcategories.map(getIds);
        };
    };
    const categoriesTree = categories.map(cat => getSubcategories(cat, categories));
    const category = categoriesTree.find(c => c.UUID == id);
    const ids: string[] = [];
    if (category) {
        getIds(category);
    };
    return ids;
}



export async function getQueryFromSearchParams(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const PROD_REG = /prod-(?<product>([^\/]+?))-(.*)\/?/i;
        const CAT_REG = /cat-(?<category>([^\/]+?))-(.*)\/?/i;
        const BRAND_REG = /(\/brands\/(?<brand>([^\/]+?)))([\/](.*))?$/i;

        if (req.url.match(PROD_REG)) {
            const prod_id = req.url.match(PROD_REG)?.groups?.product;
            const query = { _id: new ObjectId(prod_id) };
            (req as RequestCustom).queryBD = query;
            return next();
        };

        const s = req.url.split('?')[1] || req.headers.referer?.split('?')[1];
        const path = req.headers.referer || req.url;
        const search = s ? s.split('&').reduce((acc, cur) => {
            acc[cur.split('=')[0]] = decodeURI(cur.split('=')[1]);
            return acc;
        }, {} as { [key: string]: any }) : {};

        const category = path.match(CAT_REG)?.groups?.category || req.query.category;
        const brand = path.match(BRAND_REG)?.groups?.brand || req.query.brand;

        let categoryIds: string[];

        if (category) {
            search.category = category;
            categoryIds = await getCategoriesIds(category as string);
        };
        if (brand) search.brand = brand;

        if (search.s) {
            const autocomplete =
                [
                    {
                        $search: {

                            compound: {
                                should: [
                                    {
                                        autocomplete: {
                                            query: search.s,
                                            path: 'name',
                                        },
                                    },
                                    {
                                        autocomplete: {
                                            query: search.s,
                                            path: 'description',
                                        },
                                    },
                                    {
                                        autocomplete: {
                                            query: search.s,
                                            path: 'brand',
                                        },
                                    }
                                ],
                                must: [
                                    {
                                        range: {
                                            path: "amount",
                                            "gt": 0,
                                        },
                                    }
                                ]
                            },
                        },
                    },
                    { $limit: 5 },
                ];
            const fullresults =
                [
                    {
                        $search: {
                            compound: {
                                should: [
                                    {
                                        autocomplete: {
                                            query: search.s,
                                            path: 'name',
                                        },
                                    },
                                    {
                                        autocomplete: {
                                            query: search.s,
                                            path: 'description',
                                        },
                                    },
                                    {
                                        autocomplete: {
                                            query: search.s,
                                            path: 'brand',
                                        },
                                    }
                                ],
                            },
                        },
                    },
                ];
            const ResultsQty =
                [
                    {
                        $search: {
                            compound: {
                                should: [
                                    {
                                        autocomplete: {
                                            query: search.s,
                                            path: 'name',
                                        },
                                    },
                                    {
                                        autocomplete: {
                                            query: search.s,
                                            path: 'description',
                                        },
                                    },
                                    {
                                        autocomplete: {
                                            query: search.s,
                                            path: 'brand',
                                        },
                                    }
                                ],
                            },
                        },
                    },
                    {
                        $count: "searchResults"
                    }
                ];
            (req as RequestCustom).searchQueries = { autocomplete, fullresults, ResultsQty };
        } else {
            const query = Object.keys(search).reduce((acc, cur) => {
                try {
                    const key = cur as keyof typeof searchParams;
                    const productProp = searchParams[key];
                    if (productProp) {
                        let value = search[cur];
                        if (('' + value).split(';').length == 2 && cur == 'price') {
                            acc[productProp] = { $gt: +('' + value).split(';')[0], $lt: +('' + value).split(';')[1] };
                        } else if (cur == 'availability') {
                            if (search[cur]) {
                                acc[productProp] = { $gt: 0 };
                            };
                        } else if (cur == 'category') {
                            acc[productProp] = { $in: categoryIds }
                        } else {
                            acc[productProp] = search[cur] as keyof typeof search;
                        };
                    };
                    return acc;
                } catch (error) {
                    console.log(error);
                    return acc;
                };
            }, {} as RequestCustom["queryBD"]);
            (req as RequestCustom).queryBD = query;
        };
        next();
    } catch (error) {
        console.log(req.url);
        console.log(error);
    }
}