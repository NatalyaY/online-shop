import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';

type brandsState = {
    text?: string,
    breadcrumps?: {
        textRU: string,
        textEN: string
        link: string
    }[]
}[];

const initialState: brandsState = []

const brandsSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {}
});

export default brandsSlice.reducer
export const selectBrands = (state: AppState) => state.brands;
