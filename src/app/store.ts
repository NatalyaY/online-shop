import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createStateSyncMiddleware, initStateWithPrevTab, withReduxStateSync } from 'redux-state-sync';

import products from '../features/products/productsSlice';
import categories from '../features/categories/categoriesSlice';
import brands from '../features/brands/brandsSlice';
import cart from '../features/cart/cartSlice';
import favorits from '../features/favorits/favoritsSlice';
import filters from '../features/filters/filtersSlice';
import user from '../features/user/userSlice';
import orders from '../features/orders/ordersSlice';


const reducer = combineReducers({
    products,
    categories,
    brands,
    cart,
    favorits,
    filters,
    user,
    orders
});

const store = configureStore({
    reducer: reducer,
    devTools: true,
});


export default function configureAppStore(preloadedState: AppState | {}) {
    const isServer = typeof window === "undefined";

    const config = {
        reducer: withReduxStateSync(reducer),
        devTools: true,
        preloadedState,
    };

    if (!isServer) {
        const middlewares = [createStateSyncMiddleware({})];

        const store = configureStore({
            ...config,
            middleware(getDefaultMiddleware) {
                return getDefaultMiddleware().concat(middlewares)
            },
        });

        initStateWithPrevTab(store);

        return store;
    } else {
        const store = configureStore({
            ...config,
        });
        return store;
    };
};

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


