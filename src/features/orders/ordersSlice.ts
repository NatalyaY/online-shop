import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import Order from '../../../server/db/models/order';
import { error } from '../../common/generics';


interface ordersState {
    lastUpdatedId?: Order["_id"],
    orders?: Order[]
};

interface newOrder {
    items: Order['items'],
    contacts: Order['contacts']
};

const initialState: ordersState = {
};

export const CreateOrder = createAsyncThunk<
    Order,
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
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(CreateOrder.fulfilled, (state, action) => {
                if (state.orders) {
                    state.orders.push(action.payload);
                } else {
                    state.orders = [action.payload]
                };
            })
    }
});

export default ordersSlice.reducer
export const selectOrders = (state: AppState) => state.orders.orders;
