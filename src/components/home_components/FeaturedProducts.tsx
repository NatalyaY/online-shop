import React from 'react';
import {
    Container,
} from '@mui/material';
import { products } from '../../containers/FeaturedProducts_container';
import ProductListCard from '../productList_components.tsx/productList_card';

import getCarousel, { MultipleCarousel } from './../../common/HOC/MultipleCarousel';
import CarouselHeader from './CarouselHeader';


const FeaturedProducts: React.FC<{ products: products }> = ({ products }) => {

    const time = 300;
    const delay = time + 3000;
    const { handleBack, handleForward, carouselSettings } = getCarousel({ time, delay, dots: false, itemsQty: products?.length || 0 });
    const productsToDisplay = products.slice(0, 100);

    return (
        <Container maxWidth="xl" sx={{ pb: 80 / 8 }}>
            <CarouselHeader text={'Вам может понравиться'} handleBack={handleBack} handleForward={handleForward} />
            {products &&
                <MultipleCarousel settings={carouselSettings}>
                    {
                        productsToDisplay.map((product, i) =>
                            <ProductListCard key={i} product={product}/>
                        )
                    }
                </MultipleCarousel>
            }
        </Container>
    )
}

export default FeaturedProducts;