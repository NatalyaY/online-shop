import React from 'react';
import {
    Box,
    CircularProgress
} from '@mui/material';

import ProductListCard, { ProductSkeleton, minWidth } from './ProductList_card';
import { ProductInState } from '../../../server/helpers';

const ProductList: React.FC<{ products: ProductInState[] | null[] }> = ({products}) => {
    const [isRendered, setIsRendered] = React.useState(false);

    React.useEffect(() => setIsRendered(true), []);

    return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))` }}>
            {isRendered ?
                products.map((product, i) =>
                    product ? <ProductListCard key={product._id} product={product} />
                        : <ProductSkeleton key={i} />
                )
                : <CircularProgress />
            }
        </Box>
    )
};

export default ProductList;