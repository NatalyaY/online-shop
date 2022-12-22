import React, { memo } from 'react';
import {
    Card,
    CardMedia,
    CardActionArea,
    CardContent,
    Typography,
    Stack,
    Skeleton
} from '@mui/material';
import { ProductInState } from '../../../server/helpers';
import useProductActions from './../../common/hooks/useProductActions';
import ProductLabel from '../Product/components/ProductLabel';
import AddToFavorits from '../Product/components/AddToFavorits';
import ProductPrices from '../Product/components/ProductPrices';
import AddToCart from '../Product/components/AddToCart';
import loaderStyles from '../Product/loaderStyles';

export const minWidth = '260px';

const ProductListCard: React.FC<{ product: ProductInState }> = ({ product }) => {
    const { handleAddToCart, handleAddToFavorites, isAddedToCart, isAddedToFavorites } = useProductActions(product._id);

    const prodNameStyles = {
        whiteSpace: 'pre-line',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minHeight: '3rem',
        fontSize: { xs: '14px', md: '16px' },
    };

    const mediaStyles = {
        borderRadius: 'inherit',
        aspectRatio: '1',
        width: '100%',
        objectFit: 'contain',
        position: 'absolute',
        left: 0,
        top: 0
    };

    const cardStyles = {
        borderRadius: '10px',
        flex: '1 1 0',
        minWidth: minWidth,
        '&:hover': { boxShadow: 1 },
        opacity: product.amount > 0 ? '1' : '0.5'
    };

    const cardLinkStyles = {
        p: 2,
        pb: 3,
        height: '100%',
        borderRadius: 'inherit',
        '&:hover .MuiCardActionArea-focusHighlight': { opacity: 0 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'space-between'
    }

    return (
        <Card elevation={0} sx={cardStyles} component={'article'}>
            <CardActionArea disableRipple={true} href={product.breadcrumps[product.breadcrumps.length - 1].link} sx={cardLinkStyles}>
                <Stack sx={{ width: '100%', aspectRatio: '1', borderRadius: 'inherit' }}>
                    <CardMedia component={'img'} src={`/img/products/${product._id}/300/0.webp`} sx={{ ...mediaStyles, ...loaderStyles }} />
                    <Stack direction={'row'} gap={2} justifyContent={'space-between'} sx={{ zIndex: 6 }}>
                        <ProductLabel product={product} />
                        <AddToFavorits isAddedToFavorites={isAddedToFavorites} handleAddToFavorites={handleAddToFavorites} />
                    </Stack>
                </Stack>
                <CardContent sx={{ p: 0, pt: 2, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'space-between', width: '100%' }}>
                    <Stack sx={{ minWidth: 0 }} gap={1}>
                        <ProductPrices product={product} />
                        <Typography variant='body1' sx={prodNameStyles}>{product.name}</Typography>
                    </Stack>
                    <AddToCart {...{ product, isAddedToCart, handleAddToCart }} />
                </CardContent>
            </CardActionArea>
        </Card>
    )
};

export const ProductSkeleton = () => (
    <Stack sx={{ flex: '1 1 0', minWidth: minWidth, p: 2, pb: 3, gap: 2 }}>
        <Skeleton variant="rounded" width={'100%'} height={'auto'} sx={{ aspectRatio: '1', borderRadius: '10px' }} />
        <Stack gap={3}>
            <Stack gap={1}>
                <Skeleton variant="text" width={'50%'} height={'32px'} sx={{ transform: 'none' }} />
                <Stack gap={1}>
                    <Skeleton variant="text" width={'100%'} sx={{ fontSize: '0.875rem', transform: 'none' }} />
                    <Skeleton variant="text" width={'70%'} sx={{ fontSize: '0.875rem', transform: 'none' }} />
                </Stack>
            </Stack>
            <Skeleton variant="rectangular" width={'100%'} height={'46px'} sx={{ borderRadius: 1 }} />
        </Stack>
    </Stack>
);

export default memo(ProductListCard);