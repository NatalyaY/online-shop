import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '../../app/store';
import { filtersState } from '../../common/types';

const initialState: filtersState = {}

// const stateExample: filtersState = {
//     minPrice: undefined,
//     maxPrice: undefined,
//     availiability: undefined,
//     category: undefined,
//     brand: undefined,
//     s: undefined,
//     sort: undefined,
// }


// const setters = getSetters(stateExample);
// const clearers = getClearers(stateExample);

const filtersStateKeys: (keyof filtersState)[] = [
    'price',
    'availability',
    'category',
    'brand',
    'sorting',
    'p',
    'onpage'
];


const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        // ...setters,
        // ...clearers,
        clearFilters: state => state = initialState,
        setFilters: (state, action: PayloadAction<filtersState>) => {
            const filteredParams = Object.fromEntries(Object.entries(action.payload).filter(e => (filtersStateKeys as any).includes(e[0])));
            Object.keys(filteredParams).forEach(k => {
                const key = k as keyof typeof state;
                (state[key] as typeof state[typeof key]) = filteredParams[key];
            });
        }
    }
});


export const filterActions = filtersSlice.actions;

export default filtersSlice.reducer;
export const selectFilters = (state: AppState) => state.filters;
