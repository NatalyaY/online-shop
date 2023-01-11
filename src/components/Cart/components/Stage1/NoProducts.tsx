import React from 'react';
import { ProductsCarousel } from '../../../Product/Product';
import { Typography, Stack, Button } from '@mui/material';
import { noResultsContainerStyles } from '../../../Catalog/Catalog';
import { viewedProducts } from '../../../../containers/Cart/Cart_container';

const NoProducts: React.FC<{ viewedProducts: viewedProducts; }> = ({ viewedProducts }) => {
    return (
        <>
            <Typography variant="h1">
                Корзина
            </Typography>
            <Stack sx={noResultsContainerStyles('/img/no-cart.png')}>
                <Typography variant='h6' sx={{ fontWeight: 600, zIndex: 1 }}>Корзина пуста</Typography>
                <Typography sx={{ zIndex: 1 }}>
                    Воспользуйтесь поиском или загляните на главную, чтобы выбрать товары
                </Typography>
                <Button href='/' variant='contained' sx={{ mt: 2 }}>На главную</Button>
            </Stack>
            <ProductsCarousel products={viewedProducts || []} type={'viewed'} heading={'Вы смотрели'} />
        </>
    );
};

export default NoProducts;
