import React from 'react';
import { Typography, Stack, Paper, Link, Skeleton } from '@mui/material';
import { orderedProduct } from './CartTYP';

const ProductInCartTYP: React.FC<{ product: orderedProduct; }> = ({ product }) => {
    const { product: p, id, qty, salePrice } = product;
    const styles = {
        display: 'flex',
        gap: 2,
        py: 2,
        px: 3,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'space-between',
        minWidth: '200px',
        flexShrink: '0'
    }
    return (
        <Paper component={'article'} key={id} sx={styles}>
            {p ?
                <>
                    <Link href={p.breadcrumps[p.breadcrumps.length - 1].link} flex={'0'} className='woUnderline' display={'flex'}>
                        <img src={`/img/products/${p._id}/100/${0}.webp`} style={{ objectFit: 'contain' }} />
                    </Link>
                    <Stack gap={2} justifyContent={'center'}>
                        <Stack maxWidth={'150px'}>
                            <Typography variant='h6' sx={{ whiteSpace: 'normal' }}>{p.name}</Typography>
                            <Typography variant='h6' sx={{ whiteSpace: 'normal', color: 'secondary.light' }}>
                                {p.brand}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Typography variant='h6' sx={{ whiteSpace: 'normal' }}>
                                {'Количество: ' + qty + ' шт.'}
                            </Typography>
                            <Typography variant='h6' sx={{ whiteSpace: 'normal' }}>
                                {'Цена: ' + (salePrice * qty).toLocaleString('ru-RU') + ' ₽'}
                            </Typography>
                        </Stack>
                    </Stack>
                </>
                :
                <>
                    <Skeleton width={'100px'} height={'100px'} sx={{ transform: 'none' }} />
                    <Stack gap={2} flex={'1'}>
                        <Stack gap={1} width={'100%'}>
                            <Skeleton variant='text' width={'100%'} sx={{ transform: 'none' }} />
                            <Skeleton variant='text' width={'100%'} sx={{ transform: 'none' }} />
                            <Skeleton variant='text' width={'100%'} sx={{ transform: 'none' }} />
                            <Skeleton variant='text' width={'50%'} sx={{ transform: 'none' }} />
                        </Stack>
                        <Stack gap={1} width={'100%'}>
                            <Skeleton variant='text' width={'70%'} sx={{ transform: 'none' }} />
                            <Skeleton variant='text' width={'70%'} sx={{ transform: 'none' }} />
                        </Stack>
                    </Stack>
                </>}
        </Paper>
    );
};

export default ProductInCartTYP;

