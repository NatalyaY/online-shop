import React from 'react';
import ProductList from './../ProductList/ProductList';
import {
    Container,
    Typography,
} from '@mui/material';
import { ProductInState, BrandInState, CategoryInState } from '../../../server/helpers';
import getCorrectTextEndings from './../../common/helpers/getCorrectTextEndings';
import { Stack } from '@mui/system';
import { filtersState } from '../../common/types';

interface Props {
    products: ProductInState[],
    qty: number,
    brand?: BrandInState,
    category?: CategoryInState,
    filter: filtersState
}

const Catalog: React.FC<Props> = ({ products, brand, category, qty, filter }) => {
    let heading: string;
    if (category && brand) {
        heading = category.__text + ' ' + brand.text;
    } else {
        heading = category ? category.__text : brand ? 'Товары ' + brand.text : 'Все товары'
    };

    const qtyText = getCorrectTextEndings({ qty, textsArr: [' товар', ' товара', ' товаров'] });

    return (
        <Container maxWidth="xl" sx={{ pb: 80 / 8 }} component={'section'}>
            <Typography variant='h1'>{heading}</Typography>
            <Typography variant='body1' sx={{ color: 'text.disabled' }}>{`${qty} ${qtyText}`}</Typography>
            <ProductList products={products} />
        </Container>
    )
};

const ProductListFilters: React.FC<{ filter: filtersState, brand: BrandInState, category: CategoryInState }> = ({ filter, brand, category }) => {
    const {
        price,
        availability,
        category: categoryID,
        brand: brandText,
    } = filter;

    const [minPrice, maxPrice] = price?.split(';') || [undefined, undefined];

    return (
        <Stack>

        </Stack>
    )
}

export default Catalog;