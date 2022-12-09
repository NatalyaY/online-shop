import React from 'react';
import {
    Typography,
    Stack,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { BrandInState, CategoryInState } from '../../../../../server/helpers';
import { filter, clearFilter, setFilter, price } from '../../../../containers/Catalog/Catalog_container';
import Filter_categories from './components/Filter_categories';
import Filter_prices from './components/Filter_prices';
import Filter_brands from './components/Filter_brands';
import { filtersState } from '../../../../common/types';
import { StyledCircularProgress } from './../../../../common/components/styledComponents';


interface Props {
    filter: filter,
    brand?: BrandInState,
    category?: CategoryInState,
    setFilter: setFilter,
    clearFilter: clearFilter,
    price?: price,
    searchParams: filtersState
}

const Filters: React.FC<Props> = ({ filter, brand, category, clearFilter, setFilter, price, searchParams }) => {

    const handleChange = () => {
        if (filter.inStock) {
            clearFilter('inStock');
        } else {
            setFilter({ inStock: '1' })
        };
    };

    const topLevelCategories = filter.productsCategories?.filter(c => !c._parentId) || null;
    const showBackButton = Boolean(searchParams.s && topLevelCategories && topLevelCategories.length == 1 && category);

    return (
        <Stack gap={3}>
            <Stack component={'section'} gap={1}>
                <Typography variant='h5' sx={{ fontWeight: 600 }}>Категория</Typography>
                {
                    topLevelCategories &&
                    <Filter_categories categories={topLevelCategories} category={category} brand={brand} searchParams={searchParams} backBtn={showBackButton} />
                    || <StyledCircularProgress size={24} />
                }
            </Stack>
            <Stack component={'section'} gap={1}>
                <Typography variant='h5' sx={{ fontWeight: 600 }}>Цена</Typography>
                {
                    filter.maxPrice && filter.minPrice &&
                    <Filter_prices setFilter={setFilter} clearFilter={clearFilter} minPrice={filter.minPrice} maxPrice={filter.maxPrice} price={price}/>
                    || <StyledCircularProgress size={24} />
                }
            </Stack>
            <Stack component={'section'} gap={1}>
                <FormControlLabel
                    control={<Switch color="primary" checked={filter.inStock ? true : false} onChange={handleChange} />}
                    label="Только в наличии"
                    labelPlacement="start"
                    componentsProps={{
                        typography: { variant: 'h6', sx: { fontWeight: 600 } }
                    }}
                    sx={{ ml: 0, justifyContent: 'space-between' }}
                />
            </Stack>
            <Stack component={'section'} gap={1}>
                <Typography variant='h5' sx={{ fontWeight: 600 }}>Бренды</Typography>
                {
                    filter.availableBrands && filter.productsBrands &&
                    <Filter_brands
                        brand={brand}
                        setFilter={setFilter}
                        clearFilter={clearFilter}
                        availableBrands={filter.availableBrands}
                        productsBrands={filter.productsBrands}
                        selectedBrands={filter.brand}
                    />
                    || <StyledCircularProgress size={24} />
                }
            </Stack>
        </Stack>
    )
};


export default Filters;