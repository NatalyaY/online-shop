import React from 'react';
import {
    Card,
    CardMedia,
    CardActionArea,
    CardContent,
    Typography,
    Stack,
    Button,
    Chip,
    Skeleton
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { ProductInState } from '../../../server/helpers';
import useProductActions from './../../common/hooks/useProductActions';

export const minWidth = '280px';

const ProductListCard: React.FC<{ product: ProductInState }> = ({ product }) => {
    const { handleAddToCart, handleAddToFavorites, isAddedToCart, isAddedToFavorites } = useProductActions(product._id);

    const FavoritsCommonStyles = {
        cursor: 'pointer',
        borderRadius: '8px',
        fontSize: '32px',
        display: 'block',
        ml: 'auto'
    };

    const FavoritsStyles = {
        color: 'text.primary',
        '&:hover': {
            color: '#dc416d',
        },
    };

    const FavoritsActiveStyles = {
        color: '#dc416d',
        '&:hover': {
            color: '#d76c8b',
        },
    };

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

    const AddToCartButtonStyles = {
        backgroundColor: 'primary.main',
        color: 'white',
        borderColor: 'primary.main',
        '&:hover': {
            backgroundColor: '#007580',
            borderColor: '#007580',
            boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)'
        },
    };

    const InCartButtonStyles = {
        backgroundColor: 'white',
        color: 'primary.main',
        borderColor: 'primary.main'
    };

    const salePrice = product.salePrice || product.price;

    return (
        <Card elevation={0} sx={{ borderRadius: '10px', flex: '1 1 0', minWidth: minWidth, '&:hover': { boxShadow: 1 }, opacity: product.amount > 0 ? '1' : '0.5' }} component={'article'}>
            <CardActionArea disableRipple={true} href={product.breadcrumps![product.breadcrumps!.length - 1].link} sx={{ p: 2, pb: 3, height: '100%', borderRadius: 'inherit', '&:hover .MuiCardActionArea-focusHighlight': { opacity: 0 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <CardMedia image={product.image[0]} sx={{ borderRadius: 'inherit', aspectRatio: '1', width: '100%', backgroundSize: 'contain', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-between' }}>
                    <Stack direction={'row'} gap={2} justifyContent={'space-between'}>
                        {product.popularity >= 250 &&
                            <Chip label='Хит продаж' sx={{ width: 'fit-content', backgroundColor: '#F5813F', color: 'white' }} />
                        }
                        {product.creationDate >= new Date(2022, 9, 1).setHours(0, 0, 0, 0) && product.popularity < 250 &&
                            <Chip label='Новинка' sx={{ width: 'fit-content' }} color={'info'} />
                        }
                        {
                            isAddedToFavorites ?
                                <FavoriteRoundedIcon onClick={handleAddToFavorites} sx={{ ...FavoritsCommonStyles, ...FavoritsActiveStyles }} />
                                :
                                <FavoriteBorderRoundedIcon onClick={handleAddToFavorites} sx={{ ...FavoritsCommonStyles, ...FavoritsStyles }} />
                        }
                    </Stack>
                </CardMedia>
                <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'space-between', width: '100%' }}>
                    <Stack sx={{ minWidth: 0 }} gap={1}>
                        <Stack gap={2} direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ minHeight: '32px' }}>
                            <Typography variant='h4' component={'p'} sx={{ fontWeight: 600, display: 'flex', gap: 1 }}>
                                {`${salePrice} ₽`}
                                {product.salePrice &&
                                    <Typography
                                        component={'span'}
                                        sx={{
                                            textDecoration: 'line-through',
                                            color: '#dc416d',
                                            fontSize: '14px',
                                            fontWeight: 400,
                                            verticalAlign: 'top'
                                        }}>
                                        <Typography component={'span'} sx={{ color: 'text.disabled', fontSize: 'inherit', fontWeight: 'inherit' }}>{`${product.price}  ₽`}</Typography>
                                    </Typography>
                                }
                            </Typography>
                            {product.discount &&
                                <Chip label={`-${product.discount}%`} sx={{ width: 'fit-content', backgroundColor: '#dc416d', color: 'white' }} />
                            }
                        </Stack>
                        <Typography variant='body1' sx={prodNameStyles}>{product.name}</Typography>
                    </Stack>
                    {product.amount > 0 ?
                        <Button
                            onClick={handleAddToCart}
                            variant={"outlined"}
                            startIcon={isAddedToCart ? null : <ShoppingCartOutlinedIcon />}
                            sx={{ py: 1, transition: 'none', ...(isAddedToCart ? InCartButtonStyles : AddToCartButtonStyles) }}
                        >
                            {isAddedToCart ? 'В корзинe' : 'В корзину'}
                        </Button>
                        :
                        <Typography variant='body1'>Нет в наличии</Typography>
                    }
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

export default ProductListCard;