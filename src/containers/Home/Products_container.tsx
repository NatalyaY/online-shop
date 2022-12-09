import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/redux-hooks';

import Products from '../../components/Home/components/Products';
import { selectProducts, fetchCustomProducts } from '../../features/products/productsSlice';

import { ProductInState } from '../../../server/helpers';
export type products = ProductInState[];

const Products_container = () => {
    const dispatch = useAppDispatch();
    const { selectedProducts: newInProducts } = useAppSelector((state) => selectProducts(state, { sorting: "new", inStock: '1' }, true, false));
    const { selectedProducts: popularProducts } = useAppSelector((state) => selectProducts(state, { sorting: "popular", inStock: '1' }, true, false));

    React.useEffect(() => {

        if (!newInProducts) {
            dispatch(fetchCustomProducts({ params: {sorting: "new", inStock: '1'}, limit: 100 }));
        };

        if (!popularProducts) {
            dispatch(fetchCustomProducts({ params: { sorting: "popular", inStock: '1' }, limit: 100 }));
        };

    }, []);

    return <Products newInProducts={newInProducts && newInProducts.slice(0, 100) || new Array(100).fill(null)} popularProducts={popularProducts && popularProducts.slice(0, 100) || new Array(100).fill(null)} />
};

export default Products_container;