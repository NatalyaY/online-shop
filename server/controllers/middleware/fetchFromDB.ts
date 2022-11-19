import express from 'express';

import { RequestCustom, breadcrump } from '../../helpers';
import { collections } from '../../db/services/db.service';
const ObjectId = require('mongodb').ObjectId;

import Category from "../../db/models/category";
import Product from "../../db/models/product";

import { CategoryWithBreadcrumps, CategoryWithProductsQty } from '../../helpers';
import { ProductWithBreadcrumps } from '../../helpers';

import { getCategoriesIds } from './queryFromParams';


function translit(word: string) {
    const converter = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    word = word.toLowerCase();

    let answer = '';
    for (var i = 0; i < word.length; ++i) {
        if (converter[(word[i] as keyof typeof converter)] == undefined) {
            answer += word[i];
        } else {
            answer += converter[(word[i] as keyof typeof converter)];
        };
    };

    answer = answer.replace(/[^-0-9a-z]/g, '-');
    answer = answer.replace(/[-]+/g, '-');
    answer = answer.replace(/^\-|-$/g, '');
    return answer;
}

function createCategoryBreadCrumps(categories: Category[]) {
    return categories.map(cat => {
        let breadcrumps: breadcrump[] = [{ textRU: 'Главная', textEN: '/', link: '/' }];
        let categoriesPath: Partial<breadcrump>[] = [];
        grabParentCatNames(cat);

        function grabParentCatNames(cat: Category) {
            const breadcrump = {
                textRU: cat.__text,
                textEN: translit(cat.__text),
                UUID: cat.UUID
            };
            categoriesPath.unshift(breadcrump);
            if (cat._parentId) {
                const parentCat = categories?.find(category => category.UUID === cat._parentId);
                parentCat && grabParentCatNames(parentCat);
            };
        };
        categoriesPath = categoriesPath.map((breadcrump, i) => {
            breadcrump.link = categoriesPath.slice(0, i).reduce((acc, cur) => {
                delete cur.UUID;
                acc += `${cur.textEN}/`;
                return acc;
            }, '/') + `cat-${breadcrump.UUID}-${translit(breadcrump.textEN!)}`;
            delete breadcrump.UUID;
            return breadcrump;
        });
        breadcrumps.push(...(categoriesPath as breadcrump[]));
        (cat as CategoryWithBreadcrumps).breadcrumps = breadcrumps;
        return cat as CategoryWithBreadcrumps;
    });
};

function createProductBreadCrumps(products: Product[], categories: CategoryWithBreadcrumps[]) {
    return products.map((prod, i) => {
        const category = categories.find(category => category.UUID === prod.categoryId);
        if (category && category.breadcrumps) {
            const breadcrump = {
                textRU: prod.name,
                textEN: translit(prod.name),
                link: category.breadcrumps.reduce((acc, cur) => {
                    acc += (cur.textEN === '/') ? `${cur.textEN}` : `${cur.textEN}/`;
                    return acc;
                }, '') + `prod-${prod._id}-${translit(prod.name)}`
            };
            const breadcrumps = [...category.breadcrumps, breadcrump];
            (prod as ProductWithBreadcrumps).breadcrumps = breadcrumps;
        };
        return prod as ProductWithBreadcrumps;
    });
};

function createBrandBreadCrumps(brands: string[]) {
    return brands?.map((brand) => {
        return {
            text: brand,
            breadcrumps: [
                { textRU: 'Главная', textEN: '/', link: '/' },
                { textRU: 'Бренды', textEN: 'brands', link: '/brands' },
                { textRU: brand, textEN: translit(brand), link: `/brands/${translit(brand)}` },
            ]
        }
    });
};

const fetchProductsQtyByCategory = async (category: CategoryWithBreadcrumps) => {
    const ids = await getCategoriesIds(category.UUID);
    (category as CategoryWithProductsQty).productsQty = await collections.products.countDocuments({ categoryId: { $in: ids } });

    return category as CategoryWithProductsQty
}

interface params {
    limit?: number | false,
    autocomplete?: boolean,
    coll?: ('categories' | 'products' | 'brands' | 'favorites' | 'carts' | 'orders')[] | 'all',
}

export default function fetchFromDB({ limit = 100, coll = 'all', autocomplete = false }: params = {}) {
    return async function fetchFromDB(req: express.Request, res: express.Response, next: express.NextFunction) {
        let { page, onpage, sorting, ...query } = (req as RequestCustom).queryBD || {};
        const search = (req as RequestCustom).searchQueries;
        const user = (req as RequestCustom).currentUser;
        let skip: number = 0;
        let sort: { [key: string]: 1 | -1 } = { popularity: 1, _id: 1 };

        if (page && onpage) {
            skip = (page as number - 1) * (onpage as number);
            if (skip < 0) skip = 0;
        };

        if (sorting) {
            switch (sorting) {
                case 'new':
                    sort = { creationDate: 1, _id: 1 }
                    break;
                case 'price_desc':
                    sort = { price: 1, _id: 1 }
                    break;
                case 'price_asc':
                    sort = { price: -1, _id: 1 }
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

        const collectionsToFetch = (coll === 'all') ? ['categories', 'products', 'brands', 'favorites', 'carts', 'orders'] : coll;

        if (collectionsToFetch.includes('products')) {
            collectionsToFetch.push('productsQty', 'categories');
        };

        const promises = collectionsToFetch.reduce((acc, col) => {
            if (col == 'products') {
                if (search) {
                    if (autocomplete) {
                        acc['products'] = collections.products.aggregate(search.autocomplete).toArray().then(res => promises['products'] = res);
                    } else {
                        acc['products'] = limit ? collections.products.aggregate(search.fullresults).skip(skip).limit(limit).toArray().then(res => promises['products'] = res) : collections.products.aggregate(search.fullresults).toArray().then(res => promises['products'] = res);
                    };
                } else {
                    acc['products'] = limit ? collections.products.find(query).sort(sort).skip(skip).limit(limit).toArray().then(res => acc['products'] = res) : collections.products.find(query).sort(sort).toArray().then(res => acc['products'] = res);
                };
            } else
                if (col == 'brands') {
                    acc['brands'] = collections.products.distinct("brand").then(res => {
                        acc['brands'] = createBrandBreadCrumps(res);
                    });
                } else
                    if (col == 'productsQty') {
                        acc['productsQty'] = search ? collections.products.aggregate(search.ResultsQty).toArray().then(res => promises['productsQty'] = res[0]?.searchResults) : collections.products.countDocuments(query).then(res => acc['productsQty'] = res);
                    } else
                        if (col == 'favorites' || col == 'carts') {
                            let id = (col === 'carts') ? user.cart : user[col];
                            if (!id) return acc;
                            acc[col] = collections[col].findOne({ _id: new ObjectId(id) }).then(res => acc[col] = res);
                        } else
                            if (col == 'orders') {
                                let id = user.orders;
                                if (!id) return acc;
                                acc['orders'] = id.map(orderID => collections.orders.findOne({ _id: new ObjectId(orderID) }).then(res => acc['orders'] = res));
                            } else
                                if (col == 'categories') {
                                    acc['categories'] = collections.categories.find().toArray().then(res => acc['categories'] = createCategoryBreadCrumps(res));
                                };
            return acc;
        }, {} as Record<string, any>);

        Promise.all(Object.values(promises).flat()).then( async (res) => {
            promises.products = createProductBreadCrumps(promises.products, promises.categories).map((product) => {
                product.description = product.description?.replace(/<br \/>/g, '\n');
                return product;
            });
            promises.categories = await Promise.all(promises.categories.map(fetchProductsQtyByCategory));
            if (promises.products_autocomplete) {
                promises.products_autocomplete = createProductBreadCrumps(promises.products_autocomplete, promises.categories).map((product) => {
                    product.description = product.description?.replace(/<br \/>/g, '\n');
                    return product;
                });
            };
            (req as RequestCustom).fetchedData = promises;
            next();
        });
    };
}