import { createSlice} from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { CreateAddRemoveReducers } from '../generics';
import { favoritesState } from '../../common/types'

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
    extraReducers: (builder) => extraReducers(builder)
});

export default favoritesSlice.reducer
export const selectFavorits = (state: AppState) => state.favorits;
