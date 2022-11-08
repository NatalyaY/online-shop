import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import User from '../../../server/db/models/user';
import { CreateAddRemoveReducers, error } from '../../common/generics';


type GetAllOptionalTypes<Type> = {
    [Property in keyof Type]?: Type[Property]
};

type LoginFields = {
    phone: User['phone'],
    password: User['password'],
}

type userState = GetAllOptionalTypes<User> & {
    status: "iddle" | "loading" | "succeeded" | "failed",
    error?: string
};

const initialState: userState = {
    status: "iddle"
};

const { extraReducers, addThunk, removeThunk } = CreateAddRemoveReducers(initialState, 'user');
export { addThunk as addUserFields, removeThunk as removeUserFields };

export const Login = createAsyncThunk<
    userState,
    LoginFields,
    {
        rejectValue: { message: error['message'], item: LoginFields }
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

export const SignUp = createAsyncThunk<
    userState,
    LoginFields,
    {
        rejectValue: { message: error['message'], item: LoginFields }
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
    userState,
    undefined,
    {
        rejectValue: { message: error['message'] }
    }
>('user/logOutInDB', async (undefined, { rejectWithValue }) => {
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

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        extraReducers(builder);
        builder.addCase(Login.fulfilled, (state, action) => {
            const data = action.payload;
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
    }
});

export default userSlice.reducer
export const selectUser = (state: AppState) => state.user;
