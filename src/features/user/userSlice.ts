import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { CreateAddRemoveReducers } from '../generics';
import { UserLoginFields, userState, error, cartState, favoritesState, ordersState, UserChangePasswordFields } from '../../common/types';
import { UserMapped } from '../../../server/helpers';

const initialState: userState = {
    status: "iddle",
    state: 'unauthorized'
};

const { extraReducers, addThunk, removeThunk } = CreateAddRemoveReducers(initialState, 'user');
export { addThunk as addUserFields, removeThunk as removeUserFields };

export const Login = createAsyncThunk<
    { user: UserMapped, cart: cartState, favorits: favoritesState, orders: ordersState },
    UserLoginFields,
    {
        rejectValue: { message: error['message'], item: UserLoginFields }
    }
>('user/LoginInDB', async (item, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        });
        const responseData = await response.json();
        if (responseData.error) {
            return rejectWithValue({ message: (responseData.error as error).message, item })
        } else {
            return responseData;
        };
    } catch (err) {
        return rejectWithValue({ message: (err as error).message, item })
    };
});

export const ChangePassword = createAsyncThunk<
    undefined,
    UserChangePasswordFields,
    {
        rejectValue: { message: error['message'] }
    }
>('user/ChangePassword', async (fields, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/user/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(fields)
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

export const SignUp = createAsyncThunk<
    UserMapped,
    UserLoginFields,
    {
        rejectValue: { message: error['message'], item: UserLoginFields }
    }
>('user/createUserInDB', async (item, { rejectWithValue }) => {
    try {
        const response = await fetch('/api/user/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        });
        const responseData = await response.json();
        if (responseData.error) {
            return rejectWithValue({ message: (responseData.error as error).message, item })
        } else {
            return responseData;
        };
    } catch (err) {
        return rejectWithValue({ message: (err as error).message, item })
    };
});

export const logOut = createAsyncThunk<
    UserMapped,
    undefined,
    {
        rejectValue: { message: error['message'] }
    }
>('user/logOutInDB', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch("/api/user/logout");
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

export const setViews = createAsyncThunk<
    NonNullable<userState['viewedProducts']>,
    undefined,
    {
        rejectValue: { message: error['message'] }
    }
>('user/setViews', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch("/api/user/setViews");
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

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            delete state.error;
            state.status = 'iddle'
        }
    },
    extraReducers: (builder) => {
        extraReducers(builder);
        builder.addCase(Login.fulfilled, (state, action) => {
            const data = action.payload.user;
            return { ...data, status: 'succeeded' }
        })
            .addCase(Login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
            })
            .addCase(Login.pending, (state) => {
                state.status = 'loading';
                delete state.error
            })
            .addCase(logOut.fulfilled, (state, action) => {
                const data = action.payload;
                return { ...data, status: 'succeeded' }
            })
            .addCase(logOut.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
            })
            .addCase(logOut.pending, (state) => {
                state.status = 'loading';
                delete state.error
            })
            .addCase(SignUp.fulfilled, (state, action) => {
                const data = action.payload;
                return { ...data, status: 'succeeded' }
            })
            .addCase(SignUp.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
            })
            .addCase(SignUp.pending, (state) => {
                state.status = 'loading';
                delete state.error
            })
            .addCase(setViews.fulfilled, (state, action) => {
                state.viewedProducts = action.payload;
            })
            .addCase(ChangePassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(ChangePassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
            })
            .addCase(ChangePassword.pending, (state, action) => {
                state.status = 'loading';
                state.lastUpdatedFields = Object.keys(action.meta.arg);
                delete state.error
            })
    }
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer
export const selectUser = (state: AppState) => state.user;
