import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { getSetters, getClearers } from '../../common/generics';


interface filtersState {
    minPrice?: number,
    maxPrice?: number,
    availiability?: boolean,
    category?: string,
    brand?: string,
    s?: string,
}

const initialState: filtersState = {
}


const setters = getSetters(initialState);
const clearers = getClearers(initialState);


const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        ...setters,
        ...clearers,
        clearFilters: state => state = initialState
    }
});


export const { setMinPrice, clearMinPrice, setMaxPrice, clearMaxPrice, setAvailiability, clearAvailiability, setCategory, clearCategory, setBrand, clearBrand, setS, clearS, clearFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
export const selectFilters = (state: AppState) => state.filters;
