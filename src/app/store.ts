import { configureStore } from '@reduxjs/toolkit';
import products from '../features/products/productsSlice';
import categories from '../features/categories/categoriesSlice';
import brands from '../features/brands/brandsSlice';
import cart from '../features/cart/cartSlice';
import favorits from '../features/favorits/favoritsSlice';
import filters from '../features/filters/filtersSlice';
import user from '../features/user/userSlice';
import orders from '../features/orders/ordersSlice';


const store = configureStore({
    reducer: {
        products,
        categories,
        brands,
        cart,
        favorits,
        filters,
        user,
        orders
    },
    devTools: true
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default function configureAppStore(preloadedState: AppState | {}) {
    const store = configureStore({
        reducer: {
            products,
            categories,
            brands,
            cart,
            favorits,
            filters,
            user,
            orders
        },
        devTools: true,
        preloadedState,
    });

    return store;
}


