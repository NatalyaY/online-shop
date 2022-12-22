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
    Button,
    Box
} from '@mui/material';
import { ProductInState, BrandInState, CategoryInState } from '../../../server/helpers';
import { filter, sorting, setFilter, clearFilter, price } from '../../containers/Catalog/Catalog_container';
import getCorrectTextEndings from './../../common/helpers/getCorrectTextEndings';
import { filtersState } from '../../common/types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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

const Catalog: React.FC<Props> =
    ({
        products,
        brand,
        category,
        qty,
        filter,
        page,
        onpage,
        sorting,
        setFilter,
        clearFilter,
        price,
        searchParams
    }) => {
        const [open, setOpen] = React.useState(false);
        const navigate = useNavigate();

        const theme = useTheme();
        const isPermanent = useMediaQuery(theme.breakpoints.up('md'));
        const variant = isPermanent ? 'permanent' as 'permanent' : 'temporary' as 'temporary';

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
                const pathWObrand = category ?
                    category.breadcrumps[category.breadcrumps.length - 1].link
                    :
                    '/categories';
                navigate(pathWObrand);
            };
        };

        const filtersDrawerProps = {
            variant: variant,
            setOpen,
            open,
            filter,
            brand,
            category,
            price,
            setFilter,
            clearFilter,
            searchParams
        };

        const filtersChipsProps = {
            price,
            selectedBrands: filter.brand,
            inStock: filter.inStock,
            clearFilter,
            availableBrands: filter.availableBrands,
            handleBrandDelete,
            clearBrandAndRedirect,
            isMobile: !isPermanent
        };

        const noResultsContainerStyles = {
            alignItems: 'center',
            color: 'secondary.dark',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'url(/img/no-search-results.png) center no-repeat',
            backgroundSize: 'contain',
            py: 6,
            position: 'relative',
            '&:before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#fffffffa'
            }
        };

        function handleResetFilters(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
            clearFilter('price');
            clearFilter('inStock');
            clearFilter('brand');
        };

        return (
            <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8 }} component={'article'}>
                <Breadcrumps category={category} brand={brand} />
                <Stack direction={'row'} pb={3} pt={2} gap={1} sx={{ flexWrap: 'wrap' }}>
                    <Typography variant='h1'>{heading}</Typography>
                    <Typography variant='h5' component={'span'} sx={{ color: 'primary.main', opacity: qty ? 1 : 0, fontWeight: 600 }}>
                        {`${qty} ${qtyText}`}
                    </Typography>
                </Stack>
                <Stack direction={'row'} gap={4}>
                    <FiltersDrawer {...filtersDrawerProps} />
                    <Stack gap={3} alignItems={'center'} flex={'1 1'} sx={{ maxWidth: '100%' }}>
                        <Sorting isMobile={!isPermanent} {...{ setOpen, open, onpage, setFilter, sorting }} />
                        <FiltersChips {...filtersChipsProps} />
                        {products.length &&
                            <ProductList products={products} key={JSON.stringify(filter)} />
                            ||
                            <Stack sx={noResultsContainerStyles}>
                                <Typography variant='h6' zIndex={1}>
                                    По вашим параметрам ничего не нашлось. Попробуйте сбросить фильтры.
                                </Typography>
                                <Button variant='text' onClick={handleResetFilters}>
                                    Сбросить фильтры
                                </Button>
                            </Stack>
                        }
                        <Pagination page={page} onpage={onpage} setFilter={setFilter} qty={qty} />
                    </Stack>
                </Stack>
            </Container >
        )


    };

export default Catalog;