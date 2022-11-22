import React from 'react';
import {
    Container,
    Typography,
    Stack,
    Link,
    Box
} from '@mui/material';

import getCarousel, { MultipleCarousel } from './../../common/HOC/MultipleCarousel';
import useCategories, { type categoryWithSub } from '../../common/hooks/useCategories';
import { CSSProperties } from '@mui/styled-engine';
import getCorrectTextEndings from './../../common/getCorrectTextEndings';
import CarouselHeader from './CarouselHeader';


const Categories: React.FC<{}> = () => {

    const { topLevelCategories } = useCategories();
    const categories = topLevelCategories.map(cat => {
        if (cat.subcategories) {
            return cat.subcategories;
        } else return cat;
    }).flat();

    const time = 300;
    const delay = time + 3000;
    const { handleBack, handleForward, carouselSettings, index } = getCarousel({ time, delay, dots: false, itemsQty: categories.length, setActiveToChild: true });

    const left = { xs: 0, md: 'calc((25vw - 0.75*24px) / -2 - 2*24px)' };
    const width = { xs: '100%', md: 'calc(100vw + (25vw - 0.75*24px) / 2 + 2*24px - 0.75*24px)' };


    return (
        <Box component={'section'} sx={{ pb: 80 / 8 }}>
            <Container maxWidth="xl">
                <CarouselHeader text={'Топ категории'} handleBack={handleBack} handleForward={handleForward} />
            </Container>
            {categories &&
                <MultipleCarousel settings={carouselSettings} sx={{ gap: '24px', left: left, width: width }}>
                    {
                        categories.map((cat, i) =>
                            <Category key={i} category={cat} index={index} />
                        )
                    }
                </MultipleCarousel>
            }
        </Box>
    )
};

const Category: React.FC<{ category: categoryWithSub, index?: number }> = ({ category, index }) => {
    const ref = React.useRef<HTMLElement>(null);
    const flex = { xs: '1 1 0', md: '0 0 calc(25vw - 0.75*24px)' };

    const isCategoryActive = () => {
        if (!ref.current) return true;
        if ((index == undefined) || (ref.current.id == undefined)) return true;
        return (+ref.current.id >= index + 1) && (+ref.current.id <= index + 3) || ref.current.dataset.isActive == 'true' ? true : false;
    };

    const styles = {
        backgroundImage: `url(${category.image})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        justifyContent: 'flex-end',
        flex: flex,
        minWidth: { xs: '320px', md: 0 },
        aspectRatio: '1',
        borderRadius: '14px',
        '&:hover': {
            backgroundSize: 'auto 105%',
        },
        '&:not(.active):before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: { xs: 'transparent', md: isCategoryActive() ? 'transparent' : '#ffffffc9'},
        },
    };

    const qtyText = getCorrectTextEndings({ qty: category.productsQty!, textsArr: [" товар", " товара", " товаров"] });

    return (
        <Stack ref={ref} sx={{...styles, position: 'relative'}} component={Link} href={category.breadcrumps![category.breadcrumps!.length - 1].link} className='woUnderline'>
            <Stack gap={1} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', p: 20 / 8, color: 'white', borderBottomLeftRadius: 'inherit', borderBottomRightRadius: 'inherit' }}>
                <Typography variant='h5' sx={{
                    fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: { xs: '1rem', lg: '1.25rem'}
                }}>{category.__text}</Typography>
                <Typography sx={{ opacity: '0.7' }}>{category.productsQty + qtyText}</Typography>
            </Stack>
        </Stack>
    )
}

export default Categories;