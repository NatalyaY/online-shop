import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { filtersState } from '../../common/types';

const initialState: filtersState = {}

export const filtersStateKeys: (keyof filtersState)[] = [
    'price',
    'inStock',
    'category',
    'brand',
    'sorting',
    'p',
    'onpage',
    's'
];


const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        clearFilters: (state) => state = initialState,
        setFilters: (state, action: PayloadAction<filtersState>) => {
            const filteredParams: filtersState = Object.fromEntries(Object.entries(action.payload).filter(e => (filtersStateKeys as any).includes(e[0])));
            Object.keys(filteredParams).forEach(k => {
                const key = k as keyof typeof state;
                if (key == 'price') {
                    const [min, max] = filteredParams[key]!.split(';');
                    if (isNaN(+min) || isNaN(+max)) return;
                };
                (state[key] as typeof state[typeof key]) = filteredParams[key];
            });
        },
        clearSomeFilters: (state, action: PayloadAction<keyof filtersState>) => {
            delete state[action.payload]
        }
    }
});


export const filterActions = filtersSlice.actions;

export default filtersSlice.reducer;
export const selectFilters = (state: AppState) => state.filters;
