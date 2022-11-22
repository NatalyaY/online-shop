import React from 'react';
import Carousel from './home_components/Carousel';
import Brands_container from '../containers/Brands_container';
import FeaturedProducts_container from '../containers/FeaturedProducts_container';
import Categories from './home_components/Categories';
import Home_products_container from '../containers/Home_products_container';

const Home = () => {
    return (
        <>
            <Carousel />
            <Brands_container />
            <FeaturedProducts_container/>
            <Categories/>
            <Home_products_container/>
        </>
    )
};

export default Home;
