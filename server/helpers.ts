import express from 'express';
import { ObjectId } from "mongodb";
import { collections } from './db/services/db.service';
import User from "./db/models/user";
import Category from './db/models/category';
import Product from './db/models/product';
import Favorite from './db/models/favorite';
import Cart from './db/models/cart';
import Order from './db/models/order';
import { MapDbObject } from './db/typeMapper';
import { translitBrand } from './../src/common/helpers/translitBrand';

export type fetchedData = {
    categories?: CategoryInState[],
    products?: ProductInState[],
    brands?: BrandInState[],
    favorites?: FavoriteMapped,
    cart?: CartMapped | null,
    orders?: OrderMapped[],
    productsQty?: number,
    productsBrands?: string[],
    productsCategories?: string[],
    minPrice?: number,
    maxPrice?: number,
};

export interface query {
    categoryId?: string | { $in: string[] },
    brand?: string,
    $or?: [{ salePrice: { $lte: number, $gte: number } }, { price: { $lte: number, $gte: number } }],
    amount?: { $gt: 0 },
    page?: number,
    onpage?: number,
    sorting?: 'new' | 'price_desc' | 'price_asc' | 'popular',
    _id?: ObjectId | { $in: ObjectId[] }
}

type price = string;

export type params = {
    category?: string,
    brand?: string,
    price?: `${price};${price}`,
    availability?: boolean,
    p?: string,
    onpage?: string,
    sorting?: 'new' | 'price_desc' | 'price_asc' | 'popular',
    s?: string,
    _id?: string | string[],
};

export interface RequestCustom extends express.Request {
    token: { id: ObjectId };
    currentUser: User,
    queryBD: { [k in keyof query]: query[k] },
    searchQueries: { results: { [k: string]: any }[], resultsQty: { [k: string]: any }[] },
    reqParams: params,
    fetchedData: fetchedData
};

export function setAuthCookie(res: express.Response, token: string) {
    res.cookie('token', token, {
        signed: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
};


interface breadcrump {
    textRU: string,
    textEN: string,
    link: string,
    UUID?: string
};

type categoryWithSub<C> = C & {
    subcategories?: categoryWithSub<C>[];
};

export type CategoryMapped = MapDbObject<Category>
export type ProductMapped = MapDbObject<Product>
export type FavoriteMapped = MapDbObject<Favorite>
export type CartMapped = MapDbObject<Cart>
export type OrderMapped = MapDbObject<Order>
export type UserMapped = Omit<MapDbObject<User>, '_id' | 'cart' | 'unauthorizedId' | 'orders' | 'favorites' | 'password'>
export type EditUserMapped = Omit<MapDbObject<User>, '_id' | 'cart' | 'state' | 'unauthorizedId' | 'orders' | 'favorites'>


export type ProductInState = MapDbObject<Awaited<ReturnType<typeof getProductsWithBreadCrumps>>[number]>
export type BrandInState = ReturnType<typeof getBrandWithBreadCrumps>[number]
export type CategoryWithBreadcrumps = MapDbObject<NonNullable<Awaited<ReturnType<typeof getCategoryWithBreadcrumps>>>>;

type CategoryWithBreadcrumpsAndQty = MapDbObject<CategoryWithBreadcrumps & { productsQty: number }>;

export type CategoryInState = MapDbObject<CategoryWithBreadcrumpsAndQty & {
    subcategories?: CategoryInState[];
}>;

export const getProductsWithBreadCrumps = async (products: ProductMapped[], categories: CategoryWithBreadcrumps[] | null = null) => {
    return await Promise.all(products.map(async (prod) => {
        const category = categories ? categories.find(category => category.UUID === prod.categoryId) : await getCategoryWithBreadcrumps(prod.categoryId);
        let breadcrumps: breadcrump[] = [];
        if (category && category.breadcrumps) {
            const breadcrump = {
                textRU: prod.name,
                textEN: translitBrand(prod.name),
                link: category.breadcrumps.reduce((acc, cur) => {
                    acc += (cur.textEN === '/') ? '/' : `${cur.textEN}/`;
                    return acc;
                }, '') + `prod-${prod._id}-${translitBrand(prod.name)}`
            };
            breadcrumps = [...category.breadcrumps, breadcrump];
        };
        return { ...prod, breadcrumps };
    }));
};

export const getBrandWithBreadCrumps = (brands: string[]) => {
    return brands.map((brand) => {
        return {
            text: brand,
            breadcrumps: [
                { textRU: 'Главная', textEN: '/', link: '/' },
                { textRU: 'Бренды', textEN: 'brands', link: '/brands' },
                { textRU: brand, textEN: translitBrand(brand), link: `/brands/${translitBrand(brand)}` },
            ]
        }
    });
};

export const getCategoryWithBreadcrumps = async (cat: CategoryMapped | CategoryMapped['UUID'], categories: CategoryMapped[] | null = null) => {
    const category = typeof cat == 'string' ?
        categories ?
            categories.find(c => c.UUID == cat)
            : await collections.categories.findOne({ UUID: cat })
        : cat;
    if (!category) return null;
    let breadcrumps: breadcrump[] = [{ textRU: category.__text, textEN: translitBrand(category.__text), link: '' }];
    let parentCategory = !category._parentId ? null :
        categories ?
            categories.find(c => c.UUID == category._parentId)
            : await collections.categories.findOne({ UUID: category._parentId });

    while (parentCategory) {
        const breadcrump = {
            textRU: parentCategory.__text,
            textEN: translitBrand(parentCategory.__text),
            UUID: parentCategory.UUID,
            link: ''
        };
        breadcrumps.unshift(breadcrump);
        const parent = parentCategory;
        parentCategory = !parent._parentId ? null :
            categories ?
                categories.find(c => c.UUID == parent._parentId)
                : await collections.categories.findOne({ UUID: parent._parentId });
    };

    breadcrumps.unshift({ textRU: 'Главная', textEN: '/', link: '/' });

    breadcrumps = breadcrumps.map((breadcrump, i) => {
        if (breadcrump.link == '') {
            breadcrump.link = '/categories' + breadcrumps.slice(0, i).reduce((acc, cur) => acc += cur.textEN + (cur == breadcrumps[0] ? '' : '/'), '')
                + ((i == breadcrumps.length - 1) ? `cat-${category.UUID}-` : '') + breadcrump.textEN;
        };
        return breadcrump;
    });

    return { ...category, breadcrumps }
};

export const getSubcategories = async (category: CategoryMapped['UUID'], categories: CategoryWithBreadcrumpsAndQty[] | CategoryMapped[] | null = null) => {
    const cat =
        categories ?
            categories.find(c => c.UUID == category) as typeof categories[number]
            : await collections.categories.findOne({ UUID: category });

    if (!cat) return null;

    const subcategories = categories ? categories.filter(c => c._parentId == cat.UUID) : await collections.categories.find({ _parentId: cat.UUID }).toArray();

    if (!subcategories.length) {
        return cat as categoryWithSub<Category | CategoryWithBreadcrumpsAndQty>;
    };

    const catSubcategories = <(categoryWithSub<Category | CategoryWithBreadcrumpsAndQty>)[]>(await Promise.all(subcategories.map(async (cat, _, arr) => await getSubcategories(cat.UUID, categories)))).filter(n => n != null);

    return { ...cat, subcategories: catSubcategories } as categoryWithSub<Category | CategoryWithBreadcrumpsAndQty>;
};

export const getCategoriesIds = async (id: CategoryMapped['UUID'], categories: CategoryMapped[] | null = null) => {
    const category = await getSubcategories(id, categories);
    if (!category) return [];

    const ids: string[] = [];

    const getIds = (cat: typeof category) => {
        ids.push(cat.UUID);
        if (cat.subcategories) {
            cat.subcategories.map(getIds);
        };
    };

    getIds(category);
    return ids;
};

export const getCategoriesWithAdds = async (categories: CategoryMapped[]) => {
    let categoriesWithBreadcrumpsAndQty = <CategoryWithBreadcrumpsAndQty[]>(await Promise.all(categories.map(async (category, i) => {
        const ids = await getCategoriesIds(category.UUID, categories);
        const productsQty = await collections.products.countDocuments({ categoryId: { $in: ids } });
        const categoryWithBreadcrumps = await getCategoryWithBreadcrumps(category, categories);
        if (categoryWithBreadcrumps) {
            return { ...categoryWithBreadcrumps, productsQty };
        };
    }))).filter(n => n != undefined);
    return <CategoryInState[]>(await Promise.all(categoriesWithBreadcrumpsAndQty.map(async (cat, _, arr) => await getSubcategories(cat.UUID, arr)))).filter(n => n != null)
};