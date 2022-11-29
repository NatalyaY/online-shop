import React from 'react';
import Carousel from './components/Carousel/Carousel';
import Brands_container from '../../containers/Home/Brands_container';
import FeaturedProducts_container from '../../containers/Home/FeaturedProducts_container';
import Categories from './components/Categories';
import Products_container from '../../containers/Home/Products_container';

const Home = () => {
    return (
        <>
            <Carousel />
            <Brands_container />
            <FeaturedProducts_container/>
            <Categories/>
            <Products_container />
        </>
    )
};

export default Home;
