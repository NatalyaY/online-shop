import React from 'react';
import Carousel from './home_components/Carousel';
import Brands_container from '../containers/Brands_container';
import FeaturedProducts_container from '../containers/FeaturedProducts_container';

const Home = () => {
    return (
        <>
            <Carousel />
            <Brands_container />
            <FeaturedProducts_container/>
        </>
    )
};

export default Home;
