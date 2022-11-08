import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import Category from '../../../server/db/models/category';

type categoriesState = Category[];

const initialState: categoriesState = []

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
    }
});

export default categoriesSlice.reducer
export const selectCategories = (state: AppState) => state.categories;
