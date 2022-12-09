import express from 'express';

import { collections } from '../../db/services/db.service';
const ObjectId = require('mongodb').ObjectId;
import { translitBrand } from './../../../src/common/helpers/translitBrand';

import {
    fetchedData,
    getCategoriesWithAdds,
    getCategoriesIds,
    getCategoryWithBreadcrumps,
    getBrandWithBreadCrumps,
    getProductsWithBreadCrumps,
    CategoryInState,
    CategoryWithBreadcrumps,
    RequestCustom,
    CategoryMapped,
    ProductMapped,
    FavoriteMapped,
    CartMapped,
    OrderMapped,
    query,
} from '../../helpers';

interface Params {
    limit?: number | false,
    autocomplete?: boolean,
    coll?: ('categories' | 'products' | 'brands' | 'favorites' | 'cart' | 'orders')[] | 'all',
    productOptions?: boolean
};

interface IfetchProducts {
    limit: number | false,
    search?: RequestCustom['searchQueries'],
    query: RequestCustom['queryBD'],
    sorting: RequestCustom['queryBD']['sorting'],
    sort: { [key: string]: 1 | -1 },
    skip: number,
    categories: CategoryInState[] | CategoryWithBreadcrumps[],
    fetchQty: boolean
}

const getProductsWithBreadCrumpsAndDescription = async (products: ProductMapped[], categories?: CategoryInState[] | CategoryWithBreadcrumps[]) => {
    const withBC = await getProductsWithBreadCrumps(products, categories);
    return withBC.map(product => {
        if (product.description) {
            product.description = product.description?.replace(/<br \/>/g, '\n');
        };
        return product;
    });
};

const getBrandRUname = <T extends (string | string[])>(brands: { name: string, translated: string }[], brand: T): T => {
    if (typeof brand == 'string') {
        return (brands.find(br => br.translated == brand)?.name || '') as T;
    } else {
        return (brands.filter(br => brand.includes(br.translated)).map(b => b.name)) as T;
    };
};

const prepareQuery = async (query: query, categories: CategoryInState[] | CategoryWithBreadcrumps[] | null) => {

    let skip: number = 0;
    let sort: { [key: string]: 1 | -1 } = { popularity: -1, _id: 1 };

    if (query.page) {
        skip = (query.page - 1) * (query.onpage || 20);
        if (skip < 0) {
            skip = 0;
        }
    };

    if (query.sorting) {
        switch (query.sorting) {
            case 'new':
                sort = { creationDate: -1, _id: 1 }
                break;
            case 'price_desc':
                sort = { salePrice: -1, _id: 1 }
                break;
            case 'price_asc':
                sort = { salePrice: 1, _id: 1 }
                break;
            default:
                sort = { popularity: -1, _id: 1 }
                break;
        };
    };

    if (query.brand) {
        const brands = await collections.products.distinct("brand");
        const translatedBrands = brands.map(brandName => { return { name: brandName, translated: translitBrand(brandName) } });
        if (typeof query.brand == 'string') {
            query.brand = getBrandRUname(translatedBrands, query.brand);
        } else {
            query.brand['$in'] = getBrandRUname(translatedBrands, query.brand['$in']);
        };
    };

    if (query.categoryId) {
        const ids = await getCategoriesIds(query.categoryId as string, categories);
        if (ids.length) {
            query.categoryId = { $in: ids };
        } else {
            delete query.categoryId
        };
    };

    return { query, skip, sort };
};

const adjustSearchHints = (hints: { _id: string, count: number }[]) => {
    return hints.length ? [...new Set(hints.map(hint => {
        if (!hint._id || hint._id == '') return;
        let lowerCased = hint._id.toLowerCase();
        const splitted = lowerCased.split(' ');
        if (splitted[splitted.length - 1].length <= 3) {
            lowerCased = splitted.slice(0, splitted.length - 1).join(' ');
        };
        return lowerCased;
    }))].filter((n): n is string => n !== undefined) : [];
};


const fetchProducts = async ({ limit, search, sorting, query, sort, skip, categories, fetchQty }: IfetchProducts): Promise<fetchedData> => {
    let products: ProductMapped[];

    const getProducts = () => {
        return search ?
            collections.products.aggregate<ProductMapped>([...search.results, { $match: query }])
            :
            collections.products.find<ProductMapped>(query)
    };

    const sortOption = ((sorting && sorting !== 'popular') || !search) ? sort : null;
    const skipOption = limit ? skip : 0;

    let cursor = getProducts();
    if (sortOption) {
        cursor = cursor.sort(sortOption);
    };

    products = limit ?
        await cursor.skip(skipOption).limit(limit).toArray()
        : await cursor.skip(skipOption).toArray();

    const productsWithBC = await getProductsWithBreadCrumpsAndDescription(products, categories);

    if (!fetchQty) {
        return { products: productsWithBC }
    } else {
        const productsQty = search ?
            (await collections.products.aggregate([...search.results, { $match: query }, { $count: "searchResults" }]).toArray())[0]?.searchResults || 0
            : await collections.products.countDocuments(query);

        return { products: productsWithBC, productsQty };
    };
};

const fetchFavoritsCartOrOrders = async (col: "favorites" | "cart" | "orders", user: RequestCustom['currentUser']) => {
    const result: fetchedData = {};
    let id = user[col];
    if (!id) return result;

    if (col == 'favorites') {
        const favorits = await collections.favorites.findOne<FavoriteMapped>({ _id: new ObjectId(id) });
        if (favorits) {
            result.favorites = favorits;
        };
    };

    if (col == 'cart') {
        const cart = await collections.carts.findOne<CartMapped>({ _id: new ObjectId(id) });
        if (cart) {
            result.cart = cart;
        };
    };

    if (col == 'orders') {
        const ordersId = id as NonNullable<typeof user['orders']>
        const orders = await collections.orders.find<OrderMapped>({ _id: { $in: ordersId } }).toArray();
        if (orders) {
            result.orders = orders;
        };
    };

    return result;
};

const getProductOptions = async (req: RequestCustom, query: RequestCustom['queryBD'], isSearch: boolean) => {

    const { page, onpage, sorting, _id, ...restQuery } = query;

    const { $or, amount, ...queryWOFilters } = restQuery;
    const { $or: o, ...queryWOPrice } = restQuery;
    const { brand: b, ...queryWOBrand } = restQuery;
    const queryByCategory = query.categoryId ? { categoryId: query.categoryId } : {};

    const result: fetchedData = {};
    let prices: number[];

    if (isSearch) {
        const brandsQuery = [
            ...(req as RequestCustom).searchQueries.results,
            {
                $group:
                {
                    _id: null,
                    productsBrands: { $addToSet: "$brand" },
                }
            }
        ];
        const categoriesQuery = [
            ...(req as RequestCustom).searchQueries.results, { $match: query },
            {
                $group:
                {
                    _id: null,
                    productsCategories: { $addToSet: "$categoryId" },
                }
            },
        ];
        const pricesQuery = [
            ...(req as RequestCustom).searchQueries.results, { $match: queryWOPrice },
            {
                $group:
                {
                    _id: null,
                    saleprices: { $addToSet: "$salePrice" },
                }
            }
        ];
        const availableBrandsQuery = [
            ...(req as RequestCustom).searchQueries.results, { $match: queryWOBrand },
            {
                $group:
                {
                    _id: null,
                    availableBrands: { $addToSet: "$brand" },
                }
            }
        ];

        const brandsResult = await collections.products.aggregate<{ productsBrands: string[] }>(brandsQuery).toArray();
        const availableBrandsResults = await collections.products.aggregate<{ availableBrands: string[] }>(availableBrandsQuery).toArray();
        const pricesResults = await collections.products.aggregate<{ saleprices: number[] }>(pricesQuery).toArray();
        const categoriesResults = await collections.products.aggregate<{ productsCategories: string[] }>(categoriesQuery).toArray();

        result.availableBrands = availableBrandsResults[0]?.availableBrands.sort() || [];
        result.productsBrands = brandsResult[0]?.productsBrands.sort() || [];
        result.productsCategories = categoriesResults[0]?.productsCategories.sort() || [];
        prices = pricesResults[0]?.saleprices || []
    } else {
        result.availableBrands = await collections.products.distinct('brand', queryWOBrand);
        result.productsBrands = await collections.products.distinct('brand', queryByCategory);
        result.productsCategories = await collections.products.distinct('categoryId', queryWOFilters);
        prices = await collections.products.distinct('salePrice', queryWOFilters);
    };
    result.minPrice = Math.min(...prices);
    result.maxPrice = Math.max(...prices);

    return result;
};

const getCategories = async (mapCategoriesWithAdds: boolean) => {
    let categories: CategoryInState[] | CategoryWithBreadcrumps[];
    const cats = await collections.categories.find<CategoryMapped>({}).toArray();
    if (mapCategoriesWithAdds) {
        categories = await getCategoriesWithAdds(cats);
    } else {
        categories = <CategoryWithBreadcrumps[]>(await Promise.all(cats.map(async cat => await getCategoryWithBreadcrumps(cat, cats)))).filter(n => n != null);
    };
    return categories;
};

export default function fetchFromDB({ limit = 20, coll = 'all', autocomplete = false, productOptions = true }: Params = {}) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const queryBD = (req as RequestCustom).queryBD || {};
        const search = (req as RequestCustom).searchQueries;
        const user = (req as RequestCustom).currentUser;

        if (autocomplete) {
            const products = await collections.products.aggregate<ProductMapped>([...search.results, { '$limit': 5 }]).toArray();
            const hintsObjects = await collections.products.aggregate<{ _id: string, count: number }>(search.autocompleteHints).toArray();
            const hints = adjustSearchHints(hintsObjects);
            const productsWithBC = await getProductsWithBreadCrumpsAndDescription(products);
            (req as RequestCustom).fetchedData = { products: productsWithBC, hints };
            return next();
        };

        const collectionsToFetch = (coll === 'all') ? ['categories', 'products', 'brands', 'favorites', 'cart', 'orders'] : coll;

        let result: fetchedData = {};

        const categories = await getCategories(collectionsToFetch.includes('categories'));

        if (collectionsToFetch.includes('categories')) {
            result.categories = categories as fetchedData['categories'];
        };

        const { query: { page, onpage, sorting, ...query }, skip, sort } = await prepareQuery(queryBD, categories);

        await Promise.all(collectionsToFetch.map(async col => {
            if (col == 'products') {

                if (limit && !query['_id'] && productOptions) {
                    const { availableBrands, productsBrands, productsCategories, minPrice, maxPrice } = await getProductOptions(req as RequestCustom, query, Boolean(search));

                    result.availableBrands = availableBrands;
                    result.productsBrands = productsBrands;
                    result.productsCategories = productsCategories;
                    result.minPrice = minPrice;
                    result.maxPrice = maxPrice;
                };

                const results = await fetchProducts({ limit, search, sorting, query, sort, skip, categories, fetchQty: productOptions });
                result = { ...result, ...results };
            };
            if (col == 'brands') {
                const brands = await collections.products.distinct("brand");
                result.brands = getBrandWithBreadCrumps(brands);
            };
            if (col == 'favorites' || col == 'cart' || col == 'orders') {
                const results = await fetchFavoritsCartOrOrders(col, user);
                result = { ...result, ...results };
            };
        }));

        (req as RequestCustom).fetchedData = result;

        next();
    };
}