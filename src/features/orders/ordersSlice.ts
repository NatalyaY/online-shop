import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { error, ordersState, newOrder, OrderMapped } from '../../common/types';
const initialState: ordersState = {};

export const CreateOrder = createAsyncThunk<
    OrderMapped,
    newOrder,
    {
        rejectValue: { message: error['message'] }
    }
>('orders/CreateOrder', async (item, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
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


const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(CreateOrder.fulfilled, (state, action) => {
                if (state.orders) {
                    state.orders.push(action.payload);
                    state.lastUpdatedId = action.payload._id;
                } else {
                    state.orders = [action.payload];
                    state.lastUpdatedId = action.payload._id;
                };
            })
    }
});

export default ordersSlice.reducer
export const selectOrders = (state: AppState) => state.orders.orders;
