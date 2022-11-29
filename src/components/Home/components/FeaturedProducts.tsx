import React from 'react';
import { Container, CircularProgress } from '@mui/material';
import { products } from '../../../containers/Home/FeaturedProducts_container';

import getCarousel, { MultipleCarousel } from '../../../common/HOC/MultipleCarousel';
import CarouselHeader from './Carousel/CarouselHeader';
import ProductListCard, { ProductSkeleton } from '../../ProductList/ProductList_card';


const FeaturedProducts: React.FC<{ products: products }> = ({ products }) => {
    const [isRendered, setIsRendered] = React.useState(false);
    React.useEffect(() => setIsRendered(true), []);

    const time = 300;
    const delay = time + 3000;
    const { handleBack, handleForward, carouselSettings } = getCarousel({ time, delay, dots: false, itemsQty: products.length });

    return (
        <Container maxWidth="xl" sx={{ pb: 80 / 8 }}>
            <CarouselHeader text={'Вам может понравиться'} handleBack={handleBack} handleForward={handleForward} />
            {isRendered ?
                <MultipleCarousel settings={carouselSettings}>
                    {
                        products.map((product, i) =>
                            product && <ProductListCard key={product._id + '_featured'} product={product} /> || <ProductSkeleton key={i} />
                        )

                    }
                </MultipleCarousel>
                : <CircularProgress />
            }
        </Container>
    )
}

export default FeaturedProducts;