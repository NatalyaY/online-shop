import React from 'react';
import {
    Container,
    Stack,
    Typography
} from '@mui/material';
import ProductListCard from '../productList_components.tsx/productList_card';
import { products } from '../../containers/Home_products_container';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


const Products: React.FC<{ popularProducts: products, newInProducts: products }> = ({ popularProducts, newInProducts }) => {
    const [type, setType] = React.useState('popular');

    const buttonStyles = {
        border: 'none',
        borderRadius: 0,
        fontSize: '0.875rem',
        backgroundColor: 'transparent',
        '&.Mui-selected, &.Mui-selected:hover, &:hover': {
            backgroundColor: 'transparent',
        },
        '&.Mui-selected:after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '5px',
            backgroundColor: 'primary.dark',
        }
    }

    return (
        <Container maxWidth="xl" sx={{ pb: 80 / 8 }} component={'section'}>
            <Typography variant='h2' sx={{textAlign: 'center'}}>Тысячи товаров на любой вкус</Typography>
            <ToggleButtonGroup
                value={type}
                exclusive
                onChange={(e, value) => setType(value)}
                aria-label="Сортировка продуктов"
                sx={{m: '0 auto', mt: '15px', display: 'flex', width: 'fit-content'}}
            >
                <ToggleButton value="popular" sx={buttonStyles}>Хиты продаж</ToggleButton>
                <ToggleButton value="new" sx={{...buttonStyles}}>Новинки</ToggleButton>
            </ToggleButtonGroup>
            <Stack sx={{ flexWrap: 'wrap', gap: 2 }} direction={'row'}>
                {
                    newInProducts && newInProducts.map((product, i) =>
                        <ProductListCard key={i} product={product} />
                    )
                }
            </Stack>
        </Container>
    )
}

export default Products;