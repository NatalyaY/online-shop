import React from 'react';
import { Stack, Typography, Link, Box, Skeleton } from '@mui/material';
import { ProductInState } from '../../../../server/helpers';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { SxProps, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ProductCharactersAndLinks: React.FC<{ product: ProductInState, brandAndCategoryLink?: string, brandLink?: string, categoryLink?: string, categoryName?: string }> = ({ product, brandAndCategoryLink, brandLink, categoryLink, categoryName }) => {
    const theme = useTheme();
    const upperMD = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Stack sx={{ flex: 1, maxWidth: '400px' }} gap={4}>
            {
                upperMD &&
                <ProductCharacters product={product} sx={{ fontSize: '14px' }} />
            }
            <Stack gap={1} sx={{ color: 'secondary.dark', fontSize: '0.875em' }}>
                <Link href={brandAndCategoryLink} sx={{ width: 'fit-content', display: 'flex', gap: 1, alignItems: 'center', color: 'primary.main' }}>{`${categoryName} ${product.brand}`}<ArrowForwardIosRoundedIcon fontSize='inherit' /></Link>
                <Link href={brandLink} sx={{ width: 'fit-content', display: 'flex', gap: 1, alignItems: 'center', color: 'primary.main' }}>{`Все товары ${product.brand}`}<ArrowForwardIosRoundedIcon fontSize='inherit' /></Link>
                <Link href={categoryLink} sx={{ width: 'fit-content', display: 'flex', gap: 1, alignItems: 'center', color: 'primary.main' }}>{`Все товары в категории ${categoryName}`}<ArrowForwardIosRoundedIcon fontSize='inherit' /></Link>
            </Stack>
        </Stack>
    )
};

export const ProductCharacters: React.FC<{ product: ProductInState, sx?: SxProps }> = ({ product, sx }) => {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', minWidth: '150px', maxWidth: '400px', ...sx }}>
            <Character name={'Артикул'} value={product.sku} />
            {
                product.box_height && <Character name={'Высота'} value={product.box_height} />
            }
            {
                product.box_width && <Character name={'Ширина'} value={product.box_width} />
            }
            {
                product.box_length && <Character name={'Длина'} value={product.box_length} />
            }
        </Box>
    )
};

const Character: React.FC<{ name: string, value: string }> = ({ name, value }) => {
    return (
        <>
            <Typography
                sx={{
                    color: 'secondary.dark',
                    position: 'relative',
                    fontSize: 'inherit',
                    '&:after': {
                        content: '""',
                        borderBottom: '1px dotted',
                        borderColor: '#d8d8d8',
                        display: 'block',
                        width: '100%',
                        bottom: '0.4em',
                        left: 0,
                        position: 'absolute'
                    }
                }}
            >
                <Typography component={'span'} sx={{ backgroundColor: 'white', position: 'relative', pr: 1, zIndex: 2, fontSize: 'inherit', }}>{name}</Typography>
            </Typography>
            <Typography sx={{ color: 'secondary.dark', fontSize: 'inherit', }}>{value}</Typography>
        </>
    )
};

export const ProductCharactersAndLinksSkeleton = () => {
    const theme = useTheme();
    const upperMD = useMediaQuery(theme.breakpoints.up('md'));

    const characters = [
        <Skeleton key={1} variant='text' sx={{ transform: 'none' }} />,
        <Skeleton key={2} variant='text' sx={{ transform: 'none' }} />,
        <Skeleton key={3} variant='text' sx={{ transform: 'none' }} />,
        <Skeleton key={4} variant='text' sx={{ transform: 'none' }} />
    ];

    return (
        <Stack sx={{ maxWidth: '400px', minWidth: '200px', flex: '1' }} gap={4}>
            {upperMD &&
                <Stack gap={1}>
                    {characters}
                </Stack>
            }
            <Stack gap={1} sx={{ fontSize: '0.875em' }}>
                <Skeleton variant='text' sx={{ fontSize: 'inherit', transform: 'none' }} />
                <Skeleton variant='text' sx={{ fontSize: 'inherit', transform: 'none' }} />
                <Skeleton variant='text' sx={{ fontSize: 'inherit', transform: 'none' }} />
            </Stack>
        </Stack>
    )
};

export default ProductCharactersAndLinks;