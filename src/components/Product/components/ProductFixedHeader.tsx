import React from 'react';
import { ProductInState } from '../../../../server/helpers';

import {
    Typography,
    Stack,
    Container,
    Toolbar,
    Divider,
    Box
} from '@mui/material';
import AddToCart from './AddToCart';
import AddToFavorits from './AddToFavorits';
import ProductPrices from './ProductPrices';
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme } from '@mui/material/styles';

const ProductFixedHeader = ({ threshold, product, isAddedToCart, isAddedToFavorites, handleAddToCart, handleAddToFavorites }: { threshold?: number, product: ProductInState, isAddedToCart: boolean, isAddedToFavorites: boolean, handleAddToCart: (e: React.MouseEvent<Element, MouseEvent>) => void, handleAddToFavorites: (e: React.MouseEvent<Element, MouseEvent>) => void }) => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: threshold,
    });

    return (
        trigger && <ProductHeader {...{ product, isAddedToCart, isAddedToFavorites, handleAddToCart, handleAddToFavorites }} /> || null
    )
};

const ProductHeader: React.FC<{ product: ProductInState, isAddedToCart: boolean, isAddedToFavorites: boolean, handleAddToCart: (e: React.MouseEvent<Element, MouseEvent>) => void, handleAddToFavorites: (e: React.MouseEvent<Element, MouseEvent>) => void }> = ({ product, isAddedToCart, isAddedToFavorites, handleAddToCart, handleAddToFavorites }) => {
    const header = document.querySelector('header');
    const theme = useTheme();
    const upperSM = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Toolbar disableGutters sx={{ position: 'fixed', width: '100%', bgcolor: 'white', left: 0, top: header?.clientHeight, zIndex: 1300, boxShadow: '0px 10px 10px 0 rgb(0 0 0 / 4%)' }}>
            <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box component={'img'} src={`/img/products/${product._id}/75/${0}.webp`} alt={product.name} width={'auto'} height={'48px'} sx={{ display: { xs: 'none', md: 'block' } }} />
                <Typography variant='h6' sx={{ flexGrow: 3, fontWeight: 600, fontSize: { xs: '0.875rem', md: '1.25rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</Typography>
                <Divider orientation='vertical' flexItem variant="middle" />
                <ProductPrices product={product} onlySalePrice={upperSM ? false : true} sx={{ flexGrow: 2, justifyContent: 'flex-start', alignItems: 'center' }} fontSize={{ xs: '1rem', md: '1.5rem' }} />
                <Stack direction={'row'} alignItems={'center'} gap={2}>
                    <AddToCart {...{ product, isAddedToCart, handleAddToCart }} onlyIcon={upperSM ? false : true} />
                    <AddToFavorits isAddedToFavorites={isAddedToFavorites} handleAddToFavorites={handleAddToFavorites} />
                </Stack>
            </Container>
        </Toolbar>
    )
};

export default ProductFixedHeader;