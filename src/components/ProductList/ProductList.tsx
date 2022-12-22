import React from 'react';
import {
    Box,
} from '@mui/material';

import ProductListCard, { ProductSkeleton, minWidth } from './ProductList_card';
import { ProductInState } from '../../../server/helpers';
import { StyledCircularProgress } from './../../common/components/styledComponents';

const ProductList: React.FC<{ products: (ProductInState|undefined)[] | null[] }> = ({products}) => {
    const [isRendered, setIsRendered] = React.useState(false);

    React.useEffect(() => {
        setIsRendered(true);
    }, []);

    return (
        <Box sx={{ display: 'grid', gap: 2, width: '100%', gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))` }}>
            {isRendered ?
                products.map((product, i) =>
                    product ? <ProductListCard key={product._id} product={product} />
                        : <ProductSkeleton key={i} />
                )
                : <StyledCircularProgress />
            }
        </Box>
    )
};

export default ProductList;