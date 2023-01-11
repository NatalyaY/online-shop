import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { error, ordersState, NewOrder, OrderMapped } from '../../common/types';
import { Login, logOut } from './../user/userSlice';
const initialState: ordersState = {
    status: "iddle",
    lastUpdatedId: ''
};

export const CreateOrder = createAsyncThunk<
    OrderMapped,
    NewOrder,
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
        clearOrdersError: (state) => {
            delete state.error;
            state.status = 'iddle'
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(CreateOrder.fulfilled, (state, action) => {
                if (state.orders) {
                    state.orders.push(action.payload);
                } else {
                    state.orders = [action.payload];
                };
                state.lastUpdatedId = action.payload.UUID;
                state.status = 'succeeded';
                return state;
            })
            .addCase(CreateOrder.pending, (state, action) => {
                state.status = 'loading';
                delete state.error;
                return state
            })
            .addCase(CreateOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || action.error.message;
                return state;
            })
        builder.addCase(Login.fulfilled, (state, action) => {
            return action.payload.orders;
        })
        builder.addCase(logOut.fulfilled, (state, action) => {
            return initialState;
        })
    }
});

export const { clearOrdersError } = ordersSlice.actions;

export default ordersSlice.reducer
export const selectOrders = (state: AppState) => state.orders.orders;
export const selectOrdersState = (state: AppState) => state.orders;

