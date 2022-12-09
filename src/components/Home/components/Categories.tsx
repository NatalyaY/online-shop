import React from 'react';
import {
    Container,
    Typography,
    Stack,
    Link,
    Box
} from '@mui/material';

import getCarousel, { MultipleCarousel } from '../../../common/HOC/MultipleCarousel';
import useCategories from '../../../common/hooks/useCategories';
import getCorrectTextEndings from '../../../common/helpers/getCorrectTextEndings';
import CarouselHeader from './Carousel/CarouselHeader';
import { CategoryInState } from '../../../../server/helpers';
import { useWindowWidth } from './../../../common/hooks/useWindowWidth';


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
    const gap = 24;
    const normalItemsQty = 4;
    const maxItemWidth = 500;
    const minItemWidth = 320;
    const gapQty = (normalItemsQty - 1) / normalItemsQty;

    const vars = useWindowWidth({
        'up_md': {
            elWidth: () => {
                const width = (typeof document != 'undefined') ? document.body.clientWidth / normalItemsQty - gapQty * gap : null;
                if (width) {
                    return width > maxItemWidth ? maxItemWidth : width < minItemWidth ? minItemWidth : width;
                } else {
                    return 0;
                };
            },
        }
    });

    const elQty = (typeof document != 'undefined' && vars.elWidth) ? (document.body.clientWidth + gap) / (vars.elWidth + gap) : null;
    const leftShift = (vars.elWidth && elQty && elQty >= 4) ? vars.elWidth - vars.elWidth * (1 + elQty % 1) / 2 : 0;
    const visibleItems = (!elQty || leftShift == 0) ? null : elQty == 4 ? 3 : Math.ceil(Math.ceil(elQty) / 2);
    const minvisibleIndex = visibleItems && elQty ? Math.ceil((elQty - visibleItems) / 2) : null;
    const left = { xs: 0, md: `${-leftShift}px` };
    const width = { xs: '100%', md: `calc(100% + ${leftShift}px)` };

    return (
        <Box component={'section'} sx={{ pb: 80 / 8 }}>
            <Container maxWidth="xl">
                <CarouselHeader text={'Топ категории'} handleBack={handleBack} handleForward={handleForward} />
            </Container>
            {categories &&
                <MultipleCarousel settings={carouselSettings} sx={{ gap: `${gap}px`, left: left, width: width }}>
                    {
                        categories.map((cat, i) =>
                            <Category key={i} category={cat} index={index} width={vars.elWidth ? vars.elWidth : 0} minvisibleIndex={minvisibleIndex} visibleItems={visibleItems} />
                        )
                    }
                </MultipleCarousel>
            }
        </Box>
    )
};

const Category: React.FC<{ category: CategoryInState, index?: number, width?: number, visibleItems: number | null, minvisibleIndex: number | null }> = ({ category, index, width, visibleItems, minvisibleIndex }) => {
    const ref = React.useRef<HTMLElement>(null);
    const flex = { xs: '1 1 0', md: `0 0 ${width}px` };

    const isCategoryActive = () => {
        if (!ref.current) return true;
        if ((index == undefined) || (ref.current.id == undefined)) return true;
        if (!minvisibleIndex || !visibleItems) return true;
        return (+ref.current.id >= index + minvisibleIndex) && (+ref.current.id <= index + visibleItems + minvisibleIndex - 1) || ref.current.dataset.isActive == 'true' ? true : false;
    };

    const styles = {
        backgroundImage: `url(${category.image})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        justifyContent: 'flex-end',
        flex: flex,
        minWidth: '320px',
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
            backgroundColor: { xs: 'transparent', md: isCategoryActive() ? 'transparent' : '#ffffffc9' },
        },
    };

    const qtyText = getCorrectTextEndings({ qty: category.productsQty!, textsArr: [" товар", " товара", " товаров"] });

    return (
        <Stack ref={ref} sx={{ ...styles, position: 'relative' }} component={Link} href={category.breadcrumps![category.breadcrumps!.length - 1].link} className='woUnderline'>
            <Stack gap={1} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', p: 20 / 8, color: 'white', borderBottomLeftRadius: 'inherit', borderBottomRightRadius: 'inherit' }}>
                <Typography variant='h5' sx={{
                    fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: { xs: '1rem', lg: '1.25rem' }
                }}>{category.__text}</Typography>
                <Typography sx={{ opacity: '0.7' }}>{category.productsQty + qtyText}</Typography>
            </Stack>
        </Stack>
    )
}

export default Categories;