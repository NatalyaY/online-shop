import React from 'react';
import {
    Chip,
    Checkbox,
    List,
    ListItem,
    FormControlLabel,
    Box
} from '@mui/material';
import { BrandInState } from '../../../../../../server/helpers';
import { clearFilter, filter, setFilter } from '../../../../../containers/Catalog/Catalog_container';

interface Props {
    availableBrands: NonNullable<filter['availableBrands']>,
    productsBrands: NonNullable<filter['productsBrands']>,
    selectedBrands: filter['brand'],
    brand?: BrandInState,
    clearFilter: clearFilter,
    setFilter: setFilter

}

const Filter_brands: React.FC<Props> = ({ availableBrands, productsBrands, brand, clearFilter, setFilter, selectedBrands }) => {

    const brandNamesFromFilter = selectedBrands ? decodeURIComponent(selectedBrands).split(';') : [];

    const isBrandChecked = (brand: BrandInState) => brandNamesFromFilter.includes(brand.breadcrumps[brand.breadcrumps.length - 1].textEN);
    const handleBrandChecked = (e: React.ChangeEvent<HTMLInputElement>, brand: BrandInState) => {
        const brandTextEn = brand.breadcrumps[brand.breadcrumps.length - 1].textEN;
        let newBrands: string[];

        if (e.target.checked) {
            newBrands = [...(brandNamesFromFilter || []), brandTextEn];
        } else {
            newBrands = brandNamesFromFilter.filter((name) => name != brandTextEn);
        };

        if (newBrands.length) {
            setFilter({ brand: newBrands.join(';') })
        } else {
            clearFilter('brand');
        };
    };

    const listStyles = {
        maxHeight: '310px',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#007580 transparent',
        p: 0,
        '&::-webkit-scrollbar': {
            width: '8px'
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent'
        },

        '&::-webkit-scrollbar-thumb': {
            background: '#007580'
        },
    };

    const listContainerStyles = productsBrands.length > 1 ?
        {
            py: 2,
            border: '2px solid transparent',
            borderTopColor: 'secondary.main',
            borderBottomColor: 'secondary.main'
        }
        : {};

    return (
        brand ?
            <Chip label={brand.text} />
            :
            <Box sx={listContainerStyles}>
                <List sx={listStyles}>
                    {productsBrands.map(brand =>
                        <ListItem key={brand.text} sx={{ pt: 0, pl: 0, pr: 0 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={isBrandChecked(brand)} onChange={(e) => handleBrandChecked(e, brand)} sx={{ p: 0, pr: 2 }} />
                                }
                                label={brand.text}
                                disabled={availableBrands?.findIndex(br => br.text == brand.text) == -1}
                                sx={{ m: 0 }}
                            />
                        </ListItem>
                    )}
                </List>
            </Box>
    )
};

export default Filter_brands;
