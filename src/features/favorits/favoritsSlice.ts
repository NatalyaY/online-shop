import { createSlice} from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { CreateAddRemoveReducers } from '../generics';
import { favoritesState } from '../../common/types'
import { Login, logOut } from './../user/userSlice';

const initialState: favoritesState = {
    status: "iddle",
    lastUpdatedId: ''
};

const { addThunk, removeThunk, extraReducers } = CreateAddRemoveReducers(initialState, 'favorits');
export { addThunk as addToFavorite, removeThunk as removeFromFavorites }


const favoritesSlice = createSlice({
    name: 'favorits',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        extraReducers(builder);
        builder.addCase(Login.fulfilled, (state, action) => {
            return action.payload.favorits;
        })
        builder.addCase(logOut.fulfilled, (state, action) => {
            return initialState;
        })
    }
});

export default favoritesSlice.reducer
export const selectFavorits = (state: AppState) => state.favorits;
