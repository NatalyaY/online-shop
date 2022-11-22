import React from 'react';
import { useSelector } from 'react-redux';

import Products from './../components/home_components/Products';

import { selectAllProductsWithSort } from './../features/products/productsSlice';
import { useAppSelector } from '../common/generics';

export type products = ReturnType<typeof selectAllProductsWithSort>;


const Home_products_container = () => {

    const [newInProducts, setNewInProducts] = React.useState<products | null>(useAppSelector((state) => selectAllProductsWithSort(state, "new")));
    const [popularProducts, setPopularProducts] = React.useState<products | null>(useAppSelector((state) => selectAllProductsWithSort(state, "popular")));
    const [loading, setLoading] = React.useState<boolean>(false)

    const fetchProducts = async (sorting: 'new' | 'popular') => {
        const response = await fetch("/api/products/custom", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ sorting })
        });
        const responseData = await response.json();
        if (responseData.error) {
            throw new Error(responseData.error.message);
        } else {
            return responseData.products as products;
        };
    };

    if (typeof window !== 'undefined' && !loading) {
        if (!newInProducts) {
            setLoading(true);
            fetchProducts('new').then((products) => {
                setNewInProducts(products);
            });
        };

        if (!popularProducts) {
            setLoading(true);
            fetchProducts('popular').then(products => setPopularProducts(products))
        };
    }

    return <Products newInProducts={newInProducts?.slice(0, 100) || null} popularProducts={popularProducts?.slice(0, 100) || null} />
};

export default Home_products_container;