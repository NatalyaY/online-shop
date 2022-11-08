import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import Product from '../../../server/db/models/product';
import { error } from '../../common/generics';

type productsState = {
    qty?: number,
    status?: "iddle" | "loading" | "succeeded" | "failed",
    error?: string
    products: Product[]
};

const initialState: Partial<productsState> = {
    status: "iddle"
}

export const fetchAllProducts = createAsyncThunk<
    { products: Product[] },
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
    {products: Product[], qty: number},
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

export const fetchOneProduct = createAsyncThunk<
    Product,
    string,
    {
        rejectValue: { message: error['message'] }
    }
    >('products/fetchOneProduct', async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`/api/products/prod-${id}-`);
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
                state.products ? state.products.push(...action.payload.products) : state.products = action.payload.products;
                state.qty = action.payload.qty;
            })
            .addCase(fetchOneProduct.fulfilled, (state, action) => {
                state.products ? state.products.push(action.payload) : state.products = [action.payload];
            })
    }
});


export default productsSlice.reducer;
export const selectProducts = (state: AppState) => {
    const products = state.products.products;
    const filters = state.filters;
    const categories = state.categories;

    if (Object.keys(filters).length == 0) {
        return products;
    } else {
        return !products ? [] : products.filter((product) => {
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
        })
    };
};
export const selectProductByID = (state: AppState, id: string) => {
    const products = state.products.products;
    return products ? products.find(product => product._id as unknown as string == id) || null : null;
};
