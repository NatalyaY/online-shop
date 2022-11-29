import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { CreateAddRemoveReducers } from '../generics';
import { cartState } from '../../common/types';

const initialState: cartState = {
    status: "iddle",
    lastUpdatedId: '',
};

const { addThunk, removeThunk, extraReducers } = CreateAddRemoveReducers(initialState, 'carts');
export { addThunk as addToCart, removeThunk as removeFromCart }


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => extraReducers(builder)
});

export default cartSlice.reducer
export const selectCart = (state: AppState) => state.cart;
