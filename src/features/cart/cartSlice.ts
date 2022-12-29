import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { CreateAddRemoveReducers } from '../generics';
import { cartState } from '../../common/types';
import { CreateOrder } from './../orders/ordersSlice';

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
    extraReducers: (builder) => {
        extraReducers(builder);
        builder.addCase(CreateOrder.fulfilled, (state, action) => {
            if (state.items) {
                const orderedIDs = action.payload.items.map(item => item.id);
                const newItems = state.items.filter(item => !orderedIDs.includes(item.id));
                if (newItems.length == 0) {
                    return { ...initialState, status: 'succeeded' }
                } else {
                    return { ...initialState, status: 'succeeded', items: newItems }
                };
            }
        })
    }
});

export default cartSlice.reducer
export const selectCart = (state: AppState) => state.cart;
