import { createSlice} from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import Favorite from '../../../server/db/models/favorite';
import { CreateAddRemoveReducers } from '../../common/generics';


type GetAllOptionalTypes<Type> = {
    [Property in keyof Type]?: Type[Property]
};

type favoritesState = GetAllOptionalTypes<Favorite> & {
    status: "iddle" | "loading" | "succeeded" | "failed",
    error?: string,
    lastUpdatedId?: Favorite["items"][number]
};

const initialState: favoritesState = {
    status: "iddle"
};

const { addThunk, removeThunk, extraReducers } = CreateAddRemoveReducers(initialState, 'favorits');
export { addThunk as addToFavorite, removeThunk as removeFromFavorites }


const favoritesSlice = createSlice({
    name: 'favorits',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => extraReducers(builder)
});

export default favoritesSlice.reducer
export const selectFavorits = (state: AppState) => state.favorits;
