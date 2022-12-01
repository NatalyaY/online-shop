import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { params } from '../../../server/helpers';
import type { AppState } from '../../app/store';
import { translitBrand } from '../../common/helpers/translitBrand';
import { error, productsState } from '../../common/types';

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
>('products/fetchAllProducts', async (undefined, { rejectWithValue }) => {
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
    { products: productsState['products'], qty: number, params: NonNullable<productsState['queryParams']>[number] },
    undefined,
    {
        rejectValue: { message: error['message'] }
    }
>('products/fetchSomeProducts', async (undefined, { rejectWithValue }) => {
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
    { products: productsState['products'], qty: number, params: NonNullable<productsState['queryParams']>[number] },
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
    { products: productsState['products'], qty: number, params: NonNullable<productsState['queryParams']>[number] },
    params,
    {
        rejectValue: { message: error['message'] }
    }
>('products/fetchCustomProducts', async (params, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/products/custom', {
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
                const normalizedStateProducts = JSON.parse(JSON.stringify(state.products.map(p => JSON.stringify(p))));
                const normalizedActionProducts = action.payload.products.map(p => JSON.stringify(p));

                const products = new Set([...normalizedStateProducts, ...normalizedActionProducts]);
                state.products = [...products].map(p => JSON.parse(p));
                state.qty = action.payload.qty;
                state.queryParams = state.queryParams ? [...state.queryParams, action.payload.params] : [action.payload.params];
            })
            .addCase(fetchProductsByIDs.fulfilled, (state, action) => {
                const normalizedStateProducts = JSON.parse(JSON.stringify(state.products.map(p => JSON.stringify(p))));
                const normalizedActionProducts = action.payload.products.map(p => JSON.stringify(p));

                const products = new Set([...normalizedStateProducts, ...normalizedActionProducts]);
                state.products = [...products];
            })
            .addCase(fetchCustomProducts.fulfilled, (state, action) => {
                const normalizedStateProducts = JSON.parse(JSON.stringify(state.products.map(p => JSON.stringify(p))));
                const normalizedActionProducts = action.payload.products.map(p => JSON.stringify(p));

                const products = new Set([...normalizedStateProducts, ...normalizedActionProducts]);
                state.products = [...products];
                state.queryParams = state.queryParams ? [...state.queryParams, action.payload.params] : [action.payload.params];
            })
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

    if (!productsQueryParam && state.products.qty != undefined) {
        return { selectedProducts: new Array(filters.onpage ? +filters.onpage : 20).fill(null), qty: filters.onpage ? +filters.onpage : 20 };
    };

    if (Object.keys(filters).length == 0) {
        return { selectedProducts: products, qty: products.length };
    } else {
        if (products.length == 0 || (getAllProducts && state.products.qty != undefined)) return { selectedProducts: [], qty: 0 };
        const { p, onpage, sorting, ...restFilters } = filters;

        let offset = 0;
        if (p) {
            if (state.products.qty == undefined) {
                offset = (+p - 1) * (onpage ? +onpage : 20);
                if (offset < 0) offset = 0;
            };
        };

        const filteredProducts = products.filter((product) => {
            const productCategory = categories.find(cat => cat.UUID == product.categoryId);
            let isInPrice = true;
            if (restFilters.price) {
                const [minPrice, maxPrice] = restFilters.price.split(';');
                const price = product.salePrice || product.price;
                if ((+price < +minPrice) || (+price > +maxPrice)) {
                    isInPrice = false;
                };
            };
            const isInAvailiability = restFilters.availability ? +product.amount > 0 : true;
            const isInCategory = restFilters.category ? product.categoryId == restFilters.category || (productCategory?._parentId == restFilters.category) : true;
            const isInBrand = restFilters.brand ? translitBrand(product.brand.toLowerCase()) == restFilters.brand.toLowerCase() : true;
            return isInPrice && isInCategory && isInAvailiability && isInBrand;
        });

        const sortedProducts = sortProducts(filteredProducts, sorting || 'popular');
        return { selectedProducts: paginaion ? sortedProducts.slice(offset, offset + (onpage ? +onpage : 20)) : sortedProducts, qty: filteredProducts.length };
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
        price_desc: (a, b) => (a.salePrice || a.price) > (b.salePrice || b.price) ? -1 : (a.salePrice || a.price) < (b.salePrice || b.price) ? 1 : b._id > a._id ? 1 : -1,
        price_asc: (a, b) => (a.salePrice || a.price) > (b.salePrice || b.price) ? 1 : (a.salePrice || a.price) < (b.salePrice || b.price) ? -1 : b._id > a._id ? 1 : -1,
    };
    return products.sort(sortingFns[sort]);
};
