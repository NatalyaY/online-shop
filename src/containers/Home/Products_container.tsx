import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/redux-hooks';

import Products from '../../components/Home/components/Products';
import { selectProducts, fetchCustomProducts } from '../../features/products/productsSlice';

export type products = ReturnType<typeof selectProducts>;

const Products_container = () => {
    const dispatch = useAppDispatch();
    const newInProducts = useAppSelector((state) => selectProducts(state, { sort: "new", availiability: true }, true));
    const popularProducts = useAppSelector((state) => selectProducts(state, { sort: "popular", availiability: true }, true));

    React.useEffect(() => {
        if (!newInProducts.length || !popularProducts.length) {
            if (!newInProducts.length) {
                dispatch(fetchCustomProducts({ sorting: 'new' }));
            };

            if (!popularProducts.length) {
                dispatch(fetchCustomProducts({ sorting: 'popular' }));
            };
        };
    }, []);

    return <Products newInProducts={newInProducts.length && newInProducts.slice(0, 100) || new Array(100).fill(null)} popularProducts={popularProducts.length && popularProducts.slice(0, 100) || new Array(100).fill(null)} />
};

export default Products_container;