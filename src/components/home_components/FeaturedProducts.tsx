import React from 'react';
import {
    Container,
    Typography,
    Stack,
    Box,
} from '@mui/material';
import { products } from '../../containers/FeaturedProducts_container';
import ProductListCard from '../productList_components.tsx/productList_card';

import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import getCarousel, { MultipleCarousel } from './../../common/HOC/MultipleCarousel';


const FeaturedProducts: React.FC<{ products: products }> = ({ products }) => {
    const iconsStyle = {
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: 'secondary.main',
        color: 'text.primary',
        fontSize: '44px',
        p: 12 / 8,
        '&:hover': {
            backgroundColor: 'primary.dark',
            color: 'white',
        }
    };

    const time = 300;
    const delay = time + 3000;
    const { handleBack, handleForward, carouselSettings } = getCarousel({ time, delay, dots: false, itemsQty: products?.length || 0 });

    return (
        <Container maxWidth="xl" sx={{ pb: 80 / 8 }}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={40/8}>
                <Typography variant='h2'>Рекомендуем для вас</Typography>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={18 / 8}>
                    <WestIcon onClick={handleBack} sx={iconsStyle} />
                    <EastIcon onClick={handleForward} sx={iconsStyle} />
                </Stack>
            </Stack>
            {products &&
                <MultipleCarousel settings={carouselSettings}>
                    {
                        products.slice(0, 100).map((product, i) =>
                            <ProductListCard key={i} product={product}/>
                        )
                    }
                </MultipleCarousel>
            }
        </Container>
    )
}

export default FeaturedProducts;