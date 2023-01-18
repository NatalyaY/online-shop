import React from 'react';
import {
    Stack,
    Chip,
} from '@mui/material';
import { clearFilter, filter, price } from '../../../containers/Catalog/Catalog_container';

interface Props {
    isMobile: boolean,
    price: price,
    selectedBrands: filter['brand'],
    inStock: filter['inStock'],
    clearFilter: clearFilter,
    availableBrands: filter['availableBrands'],
    handleBrandDelete: (brandToDelete: string) => void,
    clearBrandAndRedirect: () => void
}

const FiltersChips: React.FC<Props> = ({ price, selectedBrands, inStock, clearFilter, availableBrands, isMobile, handleBrandDelete, clearBrandAndRedirect }) => {

    const priceInChip = price ? decodeURIComponent(price).split(';') : null;
    const brandsInChip = selectedBrands ? decodeURIComponent(selectedBrands).split(';') : [];

    const brands = availableBrands?.filter(brand => brandsInChip.includes(brand.breadcrumps[brand.breadcrumps.length - 1].textEN));
    const mobileBrands = brands?.map(b => b.text).join(', ');

    let chipLength: number = [price, inStock, ...(isMobile ? [mobileBrands] : brandsInChip)].filter(n => n !== undefined).length;

    const chips = [
        {
            label: priceInChip ? `Цена от ${priceInChip[0]} ₽ до ${priceInChip[1]} ₽` : null,
            onDelete: () => clearFilter('price')
        },
        {
            label: inStock ? 'В наличии' : null,
            onDelete: () => clearFilter('inStock')
        },
        ...(
            isMobile ?
                [{
                    label: mobileBrands ? `Бренды: ${mobileBrands}` : null,
                    onDelete: () => clearBrandAndRedirect()
                }]
                :
                brands?.map(brand => {
                    return {
                        label: `Бренды: ${brand.text}`,
                        onDelete: () => handleBrandDelete(brand.breadcrumps[brand.breadcrumps.length - 1].textEN)
                    }
                }) || []
        )
    ];

    return (
        chipLength &&
        <Stack direction={'row'} gap={2} sx={{ flexWrap: 'wrap', width: '100%' }} justifyContent={'flex-start'}>
            {
                chips.map(chip =>
                    chip.label && <Chip key={chip.label} variant='outlined' onDelete={chip.onDelete} size='medium' label={chip.label} />
                )
            }
            {
                chipLength > 1 &&
                    <Chip color='primary' variant='outlined' onDelete={() => { clearFilter('price'); clearFilter('inStock'); clearBrandAndRedirect() }} size='medium' label={'Очистить все'} />
            }
        </Stack>
        || null
    )
};

export default FiltersChips;