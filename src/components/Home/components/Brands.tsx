import React from 'react';
import {
    Container,
    Stack,
    MenuItem,
} from '@mui/material';

import { type brands } from '../../../containers/Home/Brands_container';
import { RouterChip } from '../../../common/components/styledComponents';

import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import getCarousel, { MultipleCarousel } from '../../../common/HOC/MultipleCarousel';

const Brands: React.FC<{ brands: brands }> = ({ brands }) => {

    const time = 300;
    const delay = time + 3000;
    const { handleBack, handleForward, carouselSettings } = getCarousel({ time, delay, dots: false, itemsQty: brands.length });

    return (
        <Container maxWidth="xl" sx={{ pb: 45 / 8 }}>
            <Stack direction={'row'} alignItems={'center'} gap={2}>
                <Stack onClick={handleBack} sx={{ cursor: 'pointer' }}>
                    <ArrowBackIosRoundedIcon />
                </Stack>
                <MultipleCarousel settings={carouselSettings}>
                    {
                        brands.map((brand, i) =>
                            <Brand key={brand.text} brand={brand} />
                        )
                    }
                </MultipleCarousel>
                <Stack onClick={handleForward} sx={{ cursor: 'pointer' }}>
                    <ArrowForwardIosRoundedIcon />
                </Stack>
            </Stack>
        </Container>
    )
};

const Brand: React.FC<{ brand: brands[number] }> = ({ brand }) => {
    return (
        <MenuItem
            sx={{
                p: 0,
                '&:hover': {
                    backgroundColor: 'transparent',
                },
            }}>
            <RouterChip
                label={brand.text}
                size={'medium'}
                variant={'outlined'}
                color={'primary'}
                href={brand.breadcrumps![brand.breadcrumps!.length - 1].link}
                sx={{ fontSize: { xs: '14px', md: '16px' } }}
            />
        </MenuItem>
    )
};

export default Brands;