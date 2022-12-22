import React from 'react';

import {
    Stack,
    Box,
    Slide,
    Skeleton,
} from '@mui/material';

import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import useCarousel from '../../../common/hooks/useCarousel';
import { ProductInState } from '../../../../server/helpers';
import ProductLabel from './ProductLabel';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import loaderStyles from '../loaderStyles';

const imageContainerStyles = {
    flex: 1,
    aspectRatio: '1',
    minHeight: '100%',
    borderRadius: '8px',
    border: '1px solid',
    padding: 2,
    borderColor: 'secondary.main',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
};

const imagesCarouselStyles = {
    overflow: 'hidden scroll',
    userSelect: 'none',
    scrollbarWidth: 'none',
    touchAction: 'none',
    '&::-webkit-scrollbar': {
        width: 0,
        height: 0,
    },
    width: '100%'
};

const arrowsContainserStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    justifyContent: 'space-between',
    gap: 2,
    flexDirection: 'row',
    fontSize: { xs: 52, lg: 72 },
};

const ProductImageBlock: React.FC<{ product: ProductInState }> = ({ product }) => {
    const ref = React.useRef<HTMLElement>(null);
    const containerRef = React.useRef<HTMLElement>(null);

    const theme = useTheme();
    const upper_md = useMediaQuery(theme.breakpoints.up('md'));

    const time = 200;
    const delay = time + 3000;
    const settings = { time, delay, itemsQty: product.imagesQty, infinite: false };
    const { handleBack, handleForward, index, setIndex, direction, onPointerDown } = useCarousel(settings);

    const forwardIconStyles = {
        color: index == product.imagesQty - 1 ? 'secondary.light' : 'text.primary',
        cursor: index == product.imagesQty - 1 ? 'default' : 'pointer'
    };

    const backIconStyles = {
        color: index == 0 ? 'secondary.light' : 'text.primary',
        cursor: index == 0 ? 'default' : 'pointer'
    };

    const dotStyles = (i: number) => {
        return {
            borderRadius: '50%',
            aspectRatio: '1',
            height: '10px',
            backgroundColor: 'text.primary',
            opacity: i == index ? 1 : 0.4,
            border: '1px solid',
            borderColor: 'secondary.main',
            zIndex: 5,
            cursor: 'pointer',
        }
    };

    const imagesCarouselImgStyles = (i: number) => {
        return {
            border: '1px solid',
            borderColor: index == i ? 'primary.main' : 'transparent',
            borderRadius: '8px',
            p: 1,
            cursor: 'pointer',
            '&:hover': {
                borderColor: index == i ? 'primary.main' : '#029fae33'
            }
        }
    };

    const getDirection = (i: number) => {
        if (index == i) return direction;
        return direction == 'right' ? 'left' : 'right';
    };

    React.useEffect(() => {
        if (!ref.current) return;
        const parentBottom = ref.current.getBoundingClientRect().bottom;
        const childBottom = ref.current.children[index].getBoundingClientRect().bottom;
        if (childBottom - parentBottom > 0) {
            ref.current.scrollTop = ref.current.scrollTop + childBottom - parentBottom;
        };
        const parentTop = ref.current.getBoundingClientRect().top;
        const childTop = ref.current.children[index].getBoundingClientRect().top;
        if (childTop - parentTop < 0) {
            ref.current.scrollTop = ref.current.scrollTop + childTop - parentTop;
        };
    }, [index]);

    const images = new Array(product.imagesQty).fill(null);

    return (
        <Stack direction={'row'} sx={{ flexBasis: { xs: '500px', lg: '550px', xl: '600px' }, alignItems: 'flex-start' }} gap={2}>
            {upper_md &&
                <Stack direction={'column'} width={'74px'} gap={1} sx={{ maxHeight: '300px' }}>
                    <KeyboardArrowUpRoundedIcon fontSize='large' sx={{ ...backIconStyles, width: '100%' }} onClick={handleBack} />
                    <Stack direction={'column'} gap={1} ref={ref} sx={imagesCarouselStyles}>
                        {
                            images.map((url, i) =>
                                <Box
                                    component={'img'}
                                    src={`/img/products/${product._id}/75/${i}.webp`}
                                    alt={product.name}
                                    key={i + ' small'}
                                    onClick={() => setIndex(i)}
                                    sx={{ ...imagesCarouselImgStyles(i), ...loaderStyles }} />
                            )}
                    </Stack>
                    <KeyboardArrowDownRoundedIcon fontSize='large' sx={{ ...forwardIconStyles, width: '100%' }} onClick={handleForward} />
                </Stack>
            }
            <Stack direction={'row'} sx={imageContainerStyles} ref={containerRef} gap={2} justifyContent={'space-between'}>
                {
                    images.map((url, i) => (
                        <Slide
                            key={i + ' big'}
                            appear={false}
                            in={i == index}
                            direction={getDirection(i)}
                            timeout={time}
                            easing='linear'
                            container={containerRef.current}
                        >
                            <ProductBigImage {...{ url: `/img/products/${product._id}/600/${i}.webp`, name: product.name, onPointerDown }} />
                        </Slide>
                    ))
                }
                {!upper_md && images.length > 1 &&
                    <>
                        <Stack direction={'row'} gap={2} position={'absolute'} bottom={'10px'} left={'50%'} sx={{ transform: 'translateX(-50%)' }}>
                            {
                                images.map((image, i) =>
                                    <Box
                                        sx={dotStyles(i)}
                                        key={i + ' dot'}
                                        onClick={() => setIndex(i)}
                                    />
                                )
                            }
                        </Stack>
                        <Stack sx={arrowsContainserStyles}>
                            <ArrowBackIosRoundedIcon fontSize='inherit' onClick={handleBack} sx={backIconStyles} />
                            <ArrowForwardIosRoundedIcon fontSize='inherit' onClick={handleForward} sx={forwardIconStyles} />
                        </Stack>
                    </>
                }
                <ProductLabel product={product} />
            </Stack>
        </Stack>
    )
};

const ProductBigImage = React.forwardRef<HTMLImageElement, { url: string, name: string, onPointerDown: React.MouseEventHandler<HTMLElement> }>(({ url, name, onPointerDown }, ref) => {

    return (
        <img
            ref={ref}
            src={url}
            alt={name}
            onPointerDown={onPointerDown}
            onDragStart={(e) => e.preventDefault()}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'scale-down',
                position: 'absolute',
                left: 0,
                top: 0,
                padding: 'inherit',
                touchAction: 'none',
                ...loaderStyles
            }}
        />
    )
});

export const ProductImageBlockSkeleton = () => {

    const theme = useTheme();
    const upper_md = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Stack direction={'row'} sx={{ flexBasis: { xs: '500px', lg: '550px', xl: '600px' }, alignItems: 'flex-start' }} gap={2}>
            {upper_md &&
                <Stack direction={'column'} width={'74px'} gap={1} sx={{ maxHeight: '300px' }}>
                    <KeyboardArrowUpRoundedIcon fontSize='large' sx={{ color: 'secondary.light', width: '100%' }} />
                    <Stack direction={'column'} gap={1} sx={imagesCarouselStyles}>
                        <Skeleton variant='rounded' sx={{ borderRadius: '8px', width: '100%', aspectRatio: '1', height: 'unset' }} />
                    </Stack>
                    <KeyboardArrowDownRoundedIcon fontSize='large' sx={{ color: 'secondary.light', width: '100%' }} />
                </Stack>
            }
            <Skeleton variant='rounded' sx={{...imageContainerStyles, height: 'unset'}} />
        </Stack>
    )
};


export default ProductImageBlock;