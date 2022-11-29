import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { params } from '../../../server/helpers';
import type { AppState } from '../../app/store';
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
    { products: productsState['products'], qty: number },
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
    { products: productsState['products'], qty: number },
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
    { products: productsState['products'], qty: number },
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
                const products = new Set([...state.products, ...action.payload.products]);
                state.products = [...products];
                state.qty = action.payload.qty;
            })
            .addCase(fetchProductsByIDs.fulfilled, (state, action) => {
                const products = new Set([...state.products, ...action.payload.products]);
                state.products = [...products];
            })
            .addCase(fetchCustomProducts.fulfilled, (state, action) => {
                const products = new Set([...state.products, ...action.payload.products]);
                state.products = [...products];
            })
    }
});


export default productsSlice.reducer;

export const selectProducts = (state: AppState, filters: AppState['filters'] = state.filters, getAllProducts: boolean = false) => {
    const products = state.products.products;
    const categories = state.categories;

    if (Object.keys(filters).length == 0) {
        return products;
    } else {
        if (products.length == 0 || (getAllProducts && state.products.qty != undefined)) return [];
        const filteredProducts = products.filter((product) => {
            const productCategory = categories.find(cat => cat.UUID == product.categoryId);
            if (filters.s) {
                return product.name.includes(filters.s)
                    || product.description && product.description.includes(filters.s)
                    || product.brand.includes(filters.s)
                    || productCategory?.__text.includes(filters.s);
            };
            const isInMinPrice = filters.minPrice ? +product.price >= filters.minPrice : true;
            const isInMaxPrice = filters.maxPrice ? +product.price <= filters.maxPrice : true;
            const isInAvailiability = filters.availiability ? +product.amount > 0 : true;
            const isInCategory = filters.category ? product.categoryId == filters.category || (productCategory?._parentId == filters.category) : true;
            const isInBrand = filters.brand ? product.brand == filters.brand : true;
            return isInMinPrice && isInMaxPrice && isInCategory && isInAvailiability && isInBrand;
        });
        return filters.sort ? sortProducts(filteredProducts, filters.sort) : filteredProducts;
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
        new: (a, b) => b.creationDate - a.creationDate,
        popular: (a, b) => b.popularity - a.popularity,
        price_desc: (a, b) => (a.salePrice || a.price) > (b.salePrice || b.price) ? 1 : -1,
        price_asc: (a, b) => (a.salePrice || a.price) > (b.salePrice || b.price) ? -1 : 1,
    };
    return products.sort(sortingFns[sort]);
};
