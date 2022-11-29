import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { brandsState } from '../../common/types';

const initialState: brandsState = []

const brandsSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {}
});

export default brandsSlice.reducer
export const selectBrands = (state: AppState) => state.brands;
