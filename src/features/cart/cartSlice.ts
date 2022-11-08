import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import Cart from '../../../server/db/models/cart';
import { CreateAddRemoveReducers } from '../../common/generics';


type GetAllOptionalTypes<Type> = {
    [Property in keyof Type]?: Type[Property]
};

type cartState = GetAllOptionalTypes<Cart> & {
    status: "iddle" | "loading" | "succeeded" | "failed",
    error?: string,
    lastUpdatedId?: Cart["items"][number]
};

const initialState: cartState = {
    status: "iddle"
};

const { addThunk, removeThunk, extraReducers } = CreateAddRemoveReducers(initialState, 'carts');
export { addThunk as addToCart, removeThunk as removeFromCart }


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => extraReducers(builder)
});

export default cartSlice.reducer
export const selectCart = (state: AppState) => state.cart;
