import React from 'react';
import ProductList from '../ProductList/ProductList';
import { products } from '../../containers/Favorites/Favorites_container';
import { ProductsCarousel } from './../Product/Product';
import { Container, Typography, Stack, Link, Button } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { noResultsContainerStyles } from './../Catalog/Catalog';

const Favorits: React.FC<{ products: products, viewedProducts: products }> = ({ products, viewedProducts }) => {


    return (
        <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8, display: 'flex', gap: 4, flexDirection: 'column' }} component={'article'}>
            <Typography variant="h1">Избранное</Typography>
            {
                products.length &&
                <ProductList products={products} />
                ||
                <>
                    <Stack sx={noResultsContainerStyles('/img/no-favorite.png')}>
                        <Typography variant='h6' sx={{ fontWeight: 600, zIndex: 1 }}>В избранном пусто</Typography>
                        <Typography sx={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            Добавляйте товары с помощью <FavoriteRoundedIcon sx={{ color: '#dc416d' }} />
                        </Typography>
                        {
                            !viewedProducts.length &&
                            <Button href='/' variant='contained' sx={{mt: 2}}>Перейти на главную</Button>
                        }
                    </Stack>
                    <ProductsCarousel products={viewedProducts} type={'viewed'} heading={'Вы смотрели'} />
                </>
            }
        </Container>
    )
};

export default Favorits;