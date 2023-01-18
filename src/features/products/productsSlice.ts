import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { params } from '../../../server/helpers';
import type { AppState } from '../../app/store';
import { translitBrand } from '../../common/helpers/translitBrand';
import { error, productsState } from '../../common/types';
import getCategoryParentIds from './../../common/helpers/getCategoryParentIds';
import unify from './../../common/helpers/unify';

const initialState: productsState = {
    status: "iddle",
    products: []
}

export const fetchAllProducts = createAsyncThunk<
    { products: productsState['products'] },
    undefined,
    {
        rejectValue: { message: error['message'] }
    }
>('products/fetchAllProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch("/api/products/all");
        const responseData = await response.json();
        if (responseData.error) {
            return rejectWithValue({ message: (responseData.error as error).message })
        } else {
            return responseData;
        };
    } catch (err) {
        return rejectWithValue({ message: (err as error).message })
    };
});

export const fetchSomeProducts = createAsyncThunk<
    NonNullable<productsState['queryParams']>[number],
    undefined,
    {
        rejectValue: { message: error['message'] }
    }
>('products/fetchSomeProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/products');
        const responseData = await response.json();
        if (responseData.error) {
            return rejectWithValue({ message: (responseData.error as error).message })
        } else {
            return responseData;
        };
    } catch (err) {
        return rejectWithValue({ message: (err as error).message })
    };
});

export const fetchProductsByIDs = createAsyncThunk<
    NonNullable<productsState['queryParams']>[number],
    string[],
    {
        rejectValue: { message: error['message'] }
    }
>('products/fetchProductsByIDs', async (ids, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/products/custom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ _id: ids })
        });
        const responseData = await response.json();
        if (responseData.error) {
            return rejectWithValue({ message: (responseData.error as error).message })
        } else {
            return responseData;
        };
    } catch (err) {
        return rejectWithValue({ message: (err as error).message })
    };
});

export const fetchCustomProducts = createAsyncThunk<
    NonNullable<productsState['queryParams']>[number],
    { params: params, limit?: number },
    {
        rejectValue: { message: error['message'] }
    }
>('products/fetchCustomProducts', async (arg, { rejectWithValue }) => {
    const { params, limit } = arg;
    const url = limit ? `/api/products/custom/${limit}` : '/api/products/custom/';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(params)
        });
        const responseData = await response.json();
        if (responseData.error) {
            return rejectWithValue({ message: (responseData.error as error).message })
        } else {
            return responseData;
        };
    } catch (err) {
        return rejectWithValue({ message: (err as error).message })
    };
});

export const fetchCustomProductsBulk = createAsyncThunk<
    { params: params, limit?: number, result: (NonNullable<productsState['queryParams']>[number] | { error: error }) }[],
    { params: params, limit?: number }[],
    {
        rejectValue: { message: error['message'] }
    }
>('products/fetchCustomProductsBulk', async (arg, { rejectWithValue }) => {
    try {
        return await Promise.all(arg.map(async (a) => {
            const { params, limit } = a;
            const url = limit ? `/api/products/custom/${limit}` : '/api/products/custom/';
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(params)
            });
            return { ...a, result: await result.json() };
        }));
    } catch (err) {
        return rejectWithValue({ message: (err as error).message })
    };
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.products = action.payload.products;
            delete state.qty;
            state.status = 'succeeded';
        })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
            })
            .addCase(fetchAllProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSomeProducts.fulfilled, (state, action) => {
                const totalProducts = unify(state.products, action.payload.products);
                state.products = totalProducts;

                if (state.qty) {
                    state.qty = action.payload.qty;
                };

                state.queryParams = state.queryParams ? [...state.queryParams, action.payload] : [action.payload];
            })
            .addCase(fetchProductsByIDs.fulfilled, (state, action) => {
                const totalProducts = unify(state.products, action.payload.products);
                state.products = totalProducts;
            })
            .addCase(fetchCustomProducts.fulfilled, (state, action) => {
                const totalProducts = unify(state.products, action.payload.products);
                state.products = totalProducts;
                state.queryParams = state.queryParams ? [...state.queryParams, action.payload] : [action.payload];
            })
            .addCase(fetchCustomProductsBulk.fulfilled, (state, action) => {
                const errors = action.payload.filter((p): p is { params: params; limit?: number; result: { error: error } } => (p.result as any).error);
                const results = action.payload.filter((p): p is { params: params; limit?: number; result: NonNullable<productsState['queryParams']>[number] } => !(p.result as any).error);

                errors.forEach(payload => {
                    const params = {
                        params: payload.params,
                        products: [],
                        qty: 0,
                        maxPrice: 0,
                        minPrice: 0,
                        productsBrands: [],
                        productsCategories: [],
                        availableBrands: [],
                        availableCategories: [],
                    }
                    state.queryParams = state.queryParams ? [...state.queryParams, params] : [params];
                });

                const totalProducts = unify(state.products, ...results.map(p => p.result.products));
                state.products = totalProducts;

                results.forEach(payload => {
                    state.queryParams = state.queryParams ? [...state.queryParams, payload.result] : [payload.result];
                })
            });
    }
});


export default productsSlice.reducer;

export const selectProducts = (state: AppState, filters: AppState['filters'] = state.filters, getAllProducts: boolean = false, paginaion: boolean = true) => {
    const products = state.products.products;
    const categories = state.categories;

    const productsQueryParam = state.products.queryParams?.find(p => {
        return JSON.stringify(Object.fromEntries(Object.entries(p.params).map(e => [e[0], "" + e[1]]).sort())) ==
            JSON.stringify(Object.fromEntries(Object.entries(filters).map(e => [e[0], "" + e[1]]).sort()))
    });

    if (!productsQueryParam && ((state.products.qty != undefined && getAllProducts) || filters.s)) {
        return {
            selectedProducts: null,
            qty: null,
            minPrice: null,
            maxPrice: null,
            productsCategories: null,
            productsBrands: null,
            availableCategories: null,
            availableBrands: null
        };
    };

    if (productsQueryParam) {
        const { params, products, ...rest } = productsQueryParam;
        return { selectedProducts: paginaion ? products.slice(0, 20) : products, ...rest };
    };

    if (Object.keys(filters).length == 0) {
        const minPrice = Math.min(...products.map(p => p.salePrice));
        const maxPrice = Math.max(...products.map(p => p.salePrice));

        return {
            selectedProducts: paginaion ? products.slice(0, 20) : products,
            qty: products.length,
            minPrice,
            maxPrice,
            productsCategories: categories.map(c => c.UUID),
            productsBrands: state.brands.map(b => b.text),
            availableBrands: state.brands.map(b => b.text)
        };
    } else {
        const { p, onpage, sorting, ...restFilters } = filters;
        const onPageOrDefault = onpage ? +onpage : 20;

        let offset = 0;
        if (p) {
            if (state.products.qty == undefined) {
                offset = (+p - 1) * (onpage ? +onpage : 20);
                if (offset < 0) offset = 0;
            };
        };

        const filteredProductsByCategory = products.filter((product) => {
            return restFilters.category ? getCategoryParentIds(product.categoryId, state.categories).includes(restFilters.category) : true;
        });

        const filteredProductsByBrandOrCategory = products.filter((product) => {
            const isInCategory = restFilters.category ? getCategoryParentIds(product.categoryId, state.categories).includes(restFilters.category) : true;
            const isInBrand = restFilters.brand ? restFilters.brand.split(';').includes(translitBrand(product.brand)) : true;
            return isInCategory && isInBrand;
        });

        const getFilteredProducts = (includeBrandFilter: boolean) => (includeBrandFilter ? filteredProductsByBrandOrCategory : filteredProductsByCategory).filter((product) => {
            let isInPrice = true;
            if (restFilters.price) {
                const [minPrice, maxPrice] = decodeURIComponent(restFilters.price).split(';');
                const price = product.salePrice || product.price;
                if ((+price < +minPrice) || (+price > +maxPrice)) {
                    isInPrice = false;
                };
            };
            const isInAvailiability = restFilters.inStock ? +product.amount > 0 : true;
            return isInPrice && isInAvailiability;
        });

        const filteredProductsAllFilters = getFilteredProducts(true);
        const filteredProductsWOBrand = getFilteredProducts(false);


        const minPrice = Math.min(...filteredProductsByBrandOrCategory.map(p => p.salePrice));
        const maxPrice = Math.max(...filteredProductsByBrandOrCategory.map(p => p.salePrice));
        const productsCategories = [...new Set(filteredProductsByBrandOrCategory.map(p => getCategoryParentIds(p.categoryId, state.categories)).flat())];
        const productsBrands = [...new Set(filteredProductsByCategory.map(p => p.brand))].sort();
        const availableBrands = [...new Set(filteredProductsWOBrand.map(p => p.brand))].sort();

        const sortedProducts = sortProducts(filteredProductsAllFilters, sorting || 'popular');
        const sliced = paginaion ? sortedProducts.slice(offset, offset + onPageOrDefault) : sortedProducts;

        return {
            selectedProducts: sliced,
            qty: filteredProductsAllFilters.length,
            minPrice,
            maxPrice,
            productsCategories,
            productsBrands,
            availableBrands
        };
    };
};

export const selectProductsByIDs = (state: AppState, ids: string[]) => {
    const products = state.products.products;
    return ids.map(id => products.find(prod => prod._id === id));
};

export const selectAllProducts = (state: AppState) => {
    return state.products.qty ? null : state.products.products;
};

const sortProducts = (products: AppState['products']['products'], sort: 'new' | 'popular' | 'price_desc' | 'price_asc') => {
    const sortingFns: { [k in typeof sort]: (a: typeof products[number], b: typeof products[number]) => number } = {
        new: (a, b) => a.creationDate > b.creationDate ? -1 : a.creationDate < b.creationDate ? 1 : b._id > a._id ? 1 : -1,
        popular: (a, b) => a.popularity > b.popularity ? -1 : a.popularity < b.popularity ? 1 : b._id > a._id ? 1 : -1,
        price_desc: (a, b) => a.salePrice > b.salePrice ? -1 : a.salePrice < b.salePrice ? 1 : b._id > a._id ? 1 : -1,
        price_asc: (a, b) => a.salePrice > b.salePrice ? 1 : a.salePrice < b.salePrice ? -1 : b._id > a._id ? 1 : -1,
    };
    return products.sort(sortingFns[sort]);
};
