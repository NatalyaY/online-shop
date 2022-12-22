import React from 'react';
import { Typography, Stack, Chip } from '@mui/material';
import { ProductInState } from '../../../../server/helpers';
import { SxProps } from '@mui/material/styles';

interface IProductPricesProps {
    product: ProductInState,
    sx?: SxProps,
    fontSize?: string | { [key: string]: string },
    onlySalePrice?: boolean
}

const ProductPrices: React.FC<IProductPricesProps> = ({ product, sx, fontSize, onlySalePrice }) => {
    return (
        <Stack direction={'row'} gap={2} justifyContent={'space-between'} sx={sx}>
            <Typography variant='h3' component={'p'} sx={{ fontWeight: 600, display: 'flex', gap: 1, fontSize: fontSize, flexWrap: 'wrap', whiteSpace: 'nowrap' }}>
                {`${product.salePrice} ₽`}
                {product.discount && !onlySalePrice &&
                    <Typography
                        component={'span'}
                        sx={{
                            textDecoration: 'line-through',
                            color: '#dc416d',
                            fontSize: '14px',
                            fontWeight: 400,
                            verticalAlign: 'top',
                            whiteSpace: 'nowrap',
                            lineHeight: '1.167',
                        }}>
                        <Typography component={'span'} sx={{ color: 'text.disabled', fontSize: 'inherit', fontWeight: 'inherit', lineHeight: '1.167', }}>{`${product.price}  ₽`}</Typography>
                    </Typography>
                }
            </Typography>
            {product.discount && !onlySalePrice &&
                <Chip label={`-${product.discount}%`} sx={{ width: 'fit-content', backgroundColor: '#dc416d', color: 'white' }} />
            }
        </Stack>
    )
};

export default ProductPrices;