import React from 'react';
import {
    Card,
    CardMedia,
    CardActionArea,
    CardContent,
    Typography,
    Stack,
    Button,
} from '@mui/material';
import Product from './../../../server/db/models/product';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { CSSProperties } from '@mui/styled-engine';
import { products } from '../../containers/FeaturedProducts_container';

type product = NonNullable<products>[number]


const ProductListCard: React.FC<{ product: product, id?: string, sx?: CSSProperties }> = ({ product, sx, id }) => {

    const iconStyles = {
        cursor: 'pointer',
        borderRadius: '8px',
        backgroundColor: 'secondary.main',
        color: 'text.primary',
        fontSize: '44px',
        p: 12 / 8,
        '&:hover': {
            color: 'primary.dark',
        },
        '&.active': {
            backgroundColor: 'primary.dark',
            color: 'white',
        },
        display: 'block',
    };

    const prodNameStyles = {
        whiteSpace: 'pre-line',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minHeight: '3rem',
        fontWeight: 600,
        fontSize: { xs: '14px', md: '16px' },
    }

    const salePrice = product.salePrice || product.price;

    return (
        <Card elevation={0} id={id} sx={{ borderRadius: '10px', flex: '1 1 0', minWidth: '280px', '&:hover': {boxShadow: 1}, ...sx }} component={'article'}>
            <CardActionArea href={product.breadcrumps![product.breadcrumps!.length - 1].link} sx={{ p: 2, height: '100%', borderRadius: 'inherit', '&:hover .MuiCardActionArea-focusHighlight': { opacity: 0 } }}>
                <CardMedia image={product.image[0]} sx={{ borderRadius: 'inherit', aspectRatio: '1', width: '100%', p: 20 / 8, backgroundSize: 'contain' }}>
                    <FavoriteBorderRoundedIcon sx={{ ...iconStyles, ml: 'auto' }} />
                </CardMedia>
                <CardContent sx={{ px: 0 }}>
                    <Stack direction={'column'} gap={2} justifyContent={'space-between'}>
                        <Stack sx={{ minWidth: 0 }}>
                            <Typography variant='h5' component={'span'} sx={{ fontWeight: 600, display: 'flex', gap: 1, mb: 2 }}>
                                {`${salePrice} ₽`}
                                {product.salePrice &&
                                    <Typography sx={{ textDecoration: 'line-through', color: 'text.disabled', fontSize: '14px', fontWeight: 400, verticalAlign: 'top' }}>{`${product.price}  ₽`}</Typography>
                                }
                            </Typography>
                            <Typography variant='body1' sx={prodNameStyles}>{product.name}</Typography>
                        </Stack>
                        <Button variant="outlined" startIcon={<ShoppingCartOutlinedIcon />} sx={{ py: 1 }}>
                            В корзину
                        </Button>
                        {/* <ShoppingCartOutlinedIcon sx={iconStyles} /> */}
                    </Stack>
                </CardContent>
                {/* <FavoriteBorderRoundedIcon sx={{...iconStyles, position: 'absolute', right: '20px', top: '20px'}} /> */}
            </CardActionArea>
        </Card>
    )
}

export default ProductListCard;