import React from 'react';
import { Chip } from '@mui/material';
import { ProductInState } from '../../../../server/helpers';

const ProductLabel: React.FC<{ product: ProductInState }> = ({ product }) => {
    return (
        <>
            {
                product.popularity >= 250 ?
                    <Chip label='Хит продаж' sx={{ width: 'fit-content', backgroundColor: '#F5813F', color: 'white', zIndex: 2 }} />
                    :
                    product.creationDate >= new Date(2022, 9, 1).setHours(0, 0, 0, 0) &&
                    <Chip label='Новинка' sx={{ width: 'fit-content', zIndex: 2 }} color={'info'} />
            }
        </>
    )
};

export default ProductLabel;