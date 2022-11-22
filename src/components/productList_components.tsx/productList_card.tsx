import React from 'react';
import {
    Card,
    CardMedia,
    CardActionArea,
    CardContent,
    Typography,
    Stack,
    Button,
    Chip
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { products } from '../../containers/FeaturedProducts_container';

type product = NonNullable<products>[number]


const ProductListCard: React.FC<{ product: product }> = ({ product }) => {

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
        <Card elevation={0} sx={{ borderRadius: '10px', flex: '1 1 0', minWidth: '280px', '&:hover': { boxShadow: 1 }, opacity: product.amount > 0 ? '1' : '0.5' }} component={'article'}>
            <CardActionArea href={product.breadcrumps![product.breadcrumps!.length - 1].link} sx={{ p: 2, height: '100%', borderRadius: 'inherit', '&:hover .MuiCardActionArea-focusHighlight': { opacity: 0 } }}>
                <CardMedia image={product.image[0]} sx={{ borderRadius: 'inherit', aspectRatio: '1', width: '100%', p: 20 / 8, backgroundSize: 'contain', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-between' }}>
                    <Stack direction={'row'} gap={2} justifyContent={'space-between'}>
                        {product.popularity >= 100 &&
                            <Chip label='Хит продаж' sx={{ width: 'fit-content', backgroundColor: '#F5813F', color: 'white' }} />
                        }
                        {product.creationDate >= new Date(new Date().setDate(new Date().getDate() - 14)).setHours(0, 0, 0, 0) &&
                            <Chip label='Новинка' sx={{ width: 'fit-content' }} color={'info'}/>
                        }
                        <FavoriteBorderRoundedIcon sx={{ ...iconStyles, ml: 'auto' }} />
                    </Stack>
                </CardMedia>
                <CardContent sx={{ px: 0 }}>
                    <Stack direction={'column'} gap={2} justifyContent={'space-between'}>
                        <Stack sx={{ minWidth: 0 }}>
                            <Stack gap={2} direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                                <Typography variant='h5' component={'span'} sx={{ fontWeight: 600, display: 'flex', gap: 1 }}>
                                    {`${salePrice} ₽`}
                                    {product.salePrice &&
                                        <Typography sx={{ textDecoration: 'line-through', color: 'text.disabled', fontSize: '14px', fontWeight: 400, verticalAlign: 'top' }}>{`${product.price}  ₽`}</Typography>
                                    }
                                </Typography>
                                {product.discount &&
                                    <Chip label={`-${product.discount}%`} sx={{ width: 'fit-content', backgroundColor: '#dc416d', color: 'white' }} />
                                }
                            </Stack>
                            <Typography variant='body1' sx={prodNameStyles}>{product.name}</Typography>
                        </Stack>
                        {product.amount > 0 ?
                            <Button variant="outlined" startIcon={<ShoppingCartOutlinedIcon />} sx={{ py: 1 }}>
                                В корзину
                            </Button>
                            :
                            <Typography variant='body1'>Нет в наличии</Typography>
                        }
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ProductListCard;