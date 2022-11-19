import React from 'react';
import { useSelector } from 'react-redux';

import FeaturedProducts from './../components/home_components/FeaturedProducts';
import { selectProducts } from './../features/products/productsSlice';

export type products = ReturnType<typeof selectProducts>;


const FeaturedProducts_container = () => {

    const products = useSelector(selectProducts);

    return <FeaturedProducts products={products} />
};

export default FeaturedProducts_container;