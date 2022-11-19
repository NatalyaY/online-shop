import React from 'react';
import { useSelector } from 'react-redux';
import { selectBrands } from '../features/brands/brandsSlice';

import Brands from './../components/home_components/Brands';

export type brands = ReturnType<typeof selectBrands>;


const Brands_container = () => {

    const brands = useSelector(selectBrands);

    return <Brands brands={brands}/>
};

export default Brands_container;