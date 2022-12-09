import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from './../ProductList/ProductList';
import Breadcrumps from './components/Breadcrumps';
import Pagination from './components/Pagination';
import FiltersDrawer from './components/Filters/FiltersDrawer';
import Sorting from './components/Sorting';
import FiltersChips from './components/FiltersChips';
import {
    Container,
    Typography,
    Stack,
} from '@mui/material';
import { ProductInState, BrandInState, CategoryInState } from '../../../server/helpers';
import { filter, sorting, setFilter, clearFilter, price } from '../../containers/Catalog/Catalog_container';
import { useWindowWidth } from './../../common/hooks/useWindowWidth';
import getCorrectTextEndings from './../../common/helpers/getCorrectTextEndings';
import { filtersState } from '../../common/types';
interface Props {
    products: ProductInState[] | null[],
    qty: number | null,
    brand?: BrandInState,
    category?: CategoryInState,
    filter: filter,
    sorting: sorting,
    onpage: number,
    page: number,
    setFilter: setFilter,
    clearFilter: clearFilter,
    price?: price,
    searchParams: filtersState
};

const Catalog: React.FC<Props> = ({ products, brand, category, qty, filter, page, onpage, sorting, setFilter, clearFilter, price, searchParams }) => {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    let heading: string;

    if (category && brand) {
        heading = category.__text + ' ' + brand.text;
    } else {
        if (filter.s) {
            heading = `Товары по запросу "${filter.s}"`;
        } else if (category) {
            heading = category.__text;
        } else if (brand) {
            heading = 'Товары ' + brand.text;
        } else {
            heading = 'Все товары'
        }
    };

    const qtyText = qty ? getCorrectTextEndings({ qty, textsArr: [' товар', ' товара', ' товаров'] }) : '';

    const drawerProps = useWindowWidth({ up_md: { variant: 'permanent' as 'permanent' }, down_md: { variant: 'temporary' as 'temporary' } });

    const handleBrandDelete = (brandToDelete: string) => {
        let newBrands = filter.brand ? filter.brand.split(';').filter((name) => name != brandToDelete) : [];

        if (newBrands.length) {
            setFilter({ brand: newBrands.join(';') })
        } else {
            clearBrandAndRedirect();
        };
    };

    const clearBrandAndRedirect = () => {
        clearFilter('brand');
        if (brand) {
            const pathWObrand = category ? category.breadcrumps[category.breadcrumps.length - 1].link : '/categories';
            navigate(pathWObrand);
        };
    };

    return (
        <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8 }} component={'article'}>
            <Breadcrumps category={category} brand={brand} />
            <Stack direction={'row'} pb={3} pt={2} gap={1} sx={{ flexWrap: 'wrap' }}>
                <Typography variant='h1'>{heading}</Typography>
                <Typography variant='h5' component={'span'} sx={{ color: 'primary.main', opacity: qty ? 1 : 0, fontWeight: 600 }}>{`${qty} ${qtyText}`}</Typography>
            </Stack>
            <Stack direction={'row'} gap={4}>
                <FiltersDrawer {...{ variant: drawerProps.variant, setOpen, open, filter, brand, category, price, setFilter, clearFilter, searchParams }} />
                <Stack gap={3} alignItems={'center'} flex={'1 1'} sx={{ maxWidth: '100%' }}>
                    <Sorting isMobile={drawerProps.variant == 'temporary'} {...{ setOpen, open, onpage, setFilter, sorting }}/>
                    <FiltersChips isMobile={drawerProps.variant == 'temporary'} {...{ price, selectedBrands: filter.brand, inStock: filter.inStock, clearFilter, availableBrands: filter.availableBrands, handleBrandDelete, clearBrandAndRedirect }} />
                    <ProductList products={products} key={JSON.stringify(filter)} />
                    <Pagination page={page} onpage={onpage} setFilter={setFilter} qty={qty} />
                </Stack>
            </Stack>
        </Container >
    )


};

export default Catalog;