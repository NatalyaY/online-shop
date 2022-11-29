import express from 'express';

import { collections } from '../../db/services/db.service';
import Product from './../../db/models/product';
const ObjectId = require('mongodb').ObjectId;
import Category from './../../db/models/category';
import { MapDbObject } from '../../db/typeMapper';

import {
    fetchedData,
    getCategoriesWithAdds,
    getCategoriesIds,
    getCategoryWithBreadcrumps,
    getBrandWithBreadCrumps,
    getProductsWithBreadCrumps,
    CategoryInState,
    CategoryWithBreadcrumps,
    translit,
    RequestCustom,
    CategoryMapped,
    ProductMapped,
    FavoriteMapped,
    CartMapped,
    OrderMapped
} from '../../helpers';

interface params {
    limit?: number | false,
    autocomplete?: boolean,
    coll?: ('categories' | 'products' | 'brands' | 'favorites' | 'cart' | 'orders')[] | 'all',
}

export default function fetchFromDB({ limit = 100, coll = 'all', autocomplete = false }: params = {}) {
    return async function fetchFromDB(req: express.Request, res: express.Response, next: express.NextFunction) {
        let { page, onpage, sorting, ...query } = (req as RequestCustom).queryBD || {};
        const search = (req as RequestCustom).searchQueries;
        const user = (req as RequestCustom).currentUser;

        let skip: number = 0;
        let sort: { [key: string]: 1 | -1 } = { popularity: -1, _id: 1 };

        if (page && onpage) {
            skip = (page as number - 1) * (onpage as number);
            if (skip < 0) skip = 0;
        };

        if (sorting) {
            switch (sorting) {
                case 'new':
                    sort = { creationDate: -1, _id: 1 }
                    break;
                case 'price_desc':
                    sort = { price: -1, _id: 1 }
                    break;
                case 'price_asc':
                    sort = { price: 1, _id: 1 }
                    break;
                default:
                    sort = { popularity: -1, _id: 1 }
                    break;
            };
        };

        if (query.brand) {
            const brands = await collections.products.distinct("brand");
            const translatedBrands = brands.map(brandName => { return { name: brandName, translated: translit(brandName) } });
            if (translatedBrands) {
                query.brand = translatedBrands.find(brand => brand.translated == query.brand)?.name || '';
            };
        };

        const collectionsToFetch = (coll === 'all') ? ['categories', 'products', 'brands', 'favorites', 'cart', 'orders'] : coll;

        let result: fetchedData = {};

        let categories: CategoryInState[] | CategoryWithBreadcrumps[] | null = null;

        const getCategories = async () => {
            const cats = await collections.categories.find({}).toArray() as unknown as CategoryMapped[];
            if (collectionsToFetch.includes('categories')) {
                result.categories = await getCategoriesWithAdds(cats);

                categories = result.categories;
                collectionsToFetch.splice(collectionsToFetch.indexOf('categories'), 1);
            } else {
                categories = <CategoryWithBreadcrumps[]>(await Promise.all(cats.map(async cat => await getCategoryWithBreadcrumps(cat, cats)))).filter(n => n != null);
            };
        };
        await getCategories();

        if (query.categoryId) {
            const ids = await getCategoriesIds(query.categoryId as string, categories);
            if (ids.length) {
                query.categoryId = { $in: ids };
            } else {
                delete query.categoryId
            };
        };

        await Promise.all(collectionsToFetch.map(async col => {
            if (col == 'products') {
                let products: ProductMapped[];

                if (autocomplete) {
                    products = await collections.products.aggregate<Product>(search.results).limit(5).toArray() as unknown as ProductMapped[];
                } else if (search) {
                    products = limit ? await collections.products.aggregate<Product>(search.results).skip(skip).limit(limit).toArray() as unknown as ProductMapped[] : await collections.products.aggregate<Product>(search.results).toArray() as unknown as ProductMapped[];
                } else {
                    products = limit ? await collections.products.find(query).sort(sort).skip(skip).limit(limit).toArray() as unknown as ProductMapped[] : await collections.products.find(query).sort(sort).toArray() as unknown as ProductMapped[];
                };
                const withBC = await getProductsWithBreadCrumps(products, categories);
                result.products = withBC.map(product => {
                    if (product.description) {
                        product.description = product.description?.replace(/<br \/>/g, '\n');
                    };
                    return product;
                });
                result.productsQty = search ? (await collections.products.aggregate(search.resultsQty).toArray())[0]?.searchResults || 0 : await collections.products.countDocuments(query);
            };
            if (col == 'brands') {
                const brands = await collections.products.distinct("brand");
                result.brands = getBrandWithBreadCrumps(brands);
            };
            if (col == 'favorites' || col == 'cart' || col == 'orders') {
                let id = user[col];
                if (!id) return;

                if (col == 'favorites') {
                    const favorits = await collections.favorites.findOne({ _id: new ObjectId(id) }) as unknown as FavoriteMapped;
                    if (favorits) {
                        result.favorites = favorits;
                    };
                };

                if (col == 'cart') {
                    const cart = await collections.carts.findOne({ _id: new ObjectId(id) }) as unknown as CartMapped;
                    if (cart) {
                        result.cart = cart;
                    };
                };

                if (col == 'orders') {
                    const ordersId = id as NonNullable<typeof user['orders']>
                    const orders = await collections.orders.find({ _id: { $in: ordersId } }).toArray() as unknown as OrderMapped[];
                    if (orders) {
                        result.orders = orders;
                    };
                };
            }
        }));

        (req as RequestCustom).fetchedData = result;

        next();
    };
}