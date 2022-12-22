import React from 'react';
import { ProductInState } from '../../../server/helpers';
import useProductActions from './../../common/hooks/useProductActions';

import {
    Typography,
    Stack,
    Skeleton,
    Container,
    Breadcrumbs,
    Link,
    Divider
} from '@mui/material';
import AddToCart from './components/AddToCart';
import AddToFavorits from './components/AddToFavorits';
import ProductPrices from './components/ProductPrices';
import ProductImageBlock, { ProductImageBlockSkeleton } from './components/ProductImageBlock';
import ProductTestimonials from './components/ProductTestimonials';
import ProductCharactersAndLinks, { ProductCharactersAndLinksSkeleton } from './components/ProductCharacters';
import useMediaQuery from '@mui/material/useMediaQuery';
import ProductContent, { ProductContentSkeleton } from './components/ProductContent';
import ProductFixedHeader from './components/ProductFixedHeader';
import ProductList from '../ProductList/ProductList';
import getCarousel from '../../common/HOC/MultipleCarousel';
import { MultipleCarousel } from './../../common/HOC/MultipleCarousel';
import ProductListCard, { ProductSkeleton } from './../ProductList/ProductList_card';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

interface IProduct {
    product: ProductInState,
    brandLink?: string,
    categoryLink?: string,
    brandAndCategoryLink?: string,
    categoryName?: string,
    similar: ProductInState[] | null[],
    recommended: ProductInState[] | null[],
    viewedProducts: (ProductInState | undefined)[]
}

type Products = IProduct['similar'] | IProduct['viewedProducts'];

const rightPageAreaStyles = {
    flex: '1',
    flexBasis: '350px',
    flexDirection: 'row',
    flexWrap: 'wrap-reverse',
    gap: 2,
    alignItems: 'flex-end',
    justifyContent: { xs: 'center', lg: 'space-between' }
};

const ctaAreaStyles = (downTablet: boolean) => {
    return {
        flexBasis: downTablet ? '100%' : '350px',
        maxWidth: '500px',
        gap: 2,
        alignItems: 'center'
    }
};

const ctaStyles = {
    p: { xs: 2, md: 4 },
    py: { xs: 4, md: 6 },
    borderRadius: 1,
    boxShadow: '0 0 20px rgb(0 0 0 / 10%)',
    width: '100%',
    gap: 4
};

const Product: React.FC<IProduct> = ({ product, brandLink, categoryLink, brandAndCategoryLink, categoryName, similar, recommended, viewedProducts }) => {
    const { handleAddToCart, handleAddToFavorites, isAddedToCart, isAddedToFavorites } = useProductActions(product._id);
    const downTablet = useMediaQuery('(max-width:767px)');

    const ref = React.useRef<HTMLElement>(null);

    const priceBottom = ref.current ? ref.current.getBoundingClientRect().bottom - 80 + window.scrollY : undefined;

    return (
        <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8, display: 'flex', gap: 4, flexDirection: 'column' }} component={'article'}>
            <ProductFixedHeader {...{ product, isAddedToCart, isAddedToFavorites, handleAddToCart, handleAddToFavorites, threshold: priceBottom }} />
            <Breadcrumbs aria-label="breadcrumb">
                {
                    product.breadcrumps.map((breadcrump, i) =>
                        i == product.breadcrumps.length - 1 ?
                            <Typography key={i}>{breadcrump.textRU}</Typography>
                            :
                            <Link key={i} href={breadcrump.link}>{breadcrump.textRU}</Link>
                    )
                }
            </Breadcrumbs>
            <Typography variant='h1' pb={2}>{product.name}</Typography>
            <Stack direction={'row'} gap={4} flexWrap={downTablet ? 'wrap' : 'nowrap'} justifyContent={'center'}>
                <ProductImageBlock {...{ product, isAddedToFavorites, handleAddToFavorites }} />
                <Stack sx={rightPageAreaStyles}>
                    {!downTablet &&
                        <ProductCharactersAndLinks {...{ product, brandAndCategoryLink, brandLink, categoryLink, categoryName }} />
                    }
                    <Stack sx={ctaAreaStyles(downTablet)}>
                        <Stack sx={ctaStyles}>
                            <ProductPrices product={product} />
                            <Stack direction={'row'} justifyContent={'space-between'} gap={2} alignItems={'center'} ref={ref}>
                                <AddToCart {...{ product, isAddedToCart, handleAddToCart }} />
                                <AddToFavorits isAddedToFavorites={isAddedToFavorites} handleAddToFavorites={handleAddToFavorites} />
                            </Stack>
                        </Stack>
                        <ProductTestimonials />
                    </Stack>
                </Stack>
            </Stack>
            <Typography variant='h2'>О товаре:</Typography>
            <ProductContent product={product} brandLink={brandLink} />
            <Divider sx={{ mt: 2 }} />
            <ProductsCarousel products={similar} type={'similar'} heading={'Похожие товары'} />
            <ProductsCarousel products={viewedProducts} type={'viewed'} heading={'Вы смотрели'} />
            <Stack gap={2}>
                <Typography variant='h2'>Рекомендуем также</Typography>
                {
                    recommended.length ?
                        <ProductList products={recommended} />
                        :
                        <Typography>Нет рекомендуемых товаров</Typography>
                }
            </Stack>
        </Container>
    )
};

export const ProductsCarousel = ({ products, type, heading }: { products: Products, type: 'similar' | 'viewed', heading: string }) => {
    const time = 300;
    const delay = time + 3000;
    const settings = getCarousel({ time, delay, itemsQty: products.length });
    return (
        (type == 'similar' || products.length) &&
        <Stack gap={2} mt={2} sx={{ position: 'relative' }}>
            <Typography variant='h2'>{heading}</Typography>
            {
                products.length ?
                    <CarouselOrList products={products} settings={settings} />
                    :
                    <Typography>Нет похожих товаров</Typography>
            }
        </Stack>
        || null
    )
};

const CarouselOrList = ({ products, settings }: { products: Products, settings: ReturnType<typeof getCarousel> }) => {
    const arrowStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 4,
        cursor: 'pointer',
        fontSize: '48px'
    };

    return (
        products.length > 5 &&
        <>
            <ArrowBackIosRoundedIcon onClick={settings.handleBack} sx={{ ...arrowStyles, left: 0 }} />
            <MultipleCarousel settings={settings.carouselSettings}>
                {
                    products.map((product, i) =>
                        product && <ProductListCard key={product._id + '_featured'} product={product} /> || <ProductSkeleton key={i} />
                    )

                }
            </MultipleCarousel>
            <ArrowForwardIosRoundedIcon onClick={settings.handleForward} sx={{ ...arrowStyles, right: 0 }} />
        </>
        ||
        <ProductList products={products} />
    )
};

export const ProductPageSkeleton = () => {
    const downTablet = useMediaQuery('(max-width:767px)');

    const breadcrumps = [
        <Skeleton key={1} variant='text' width={'70px'} sx={{ transform: 'none' }} />,
        <Skeleton key={2} variant='text' width={'70px'} sx={{ transform: 'none' }} />,
        <Skeleton key={3} variant='text' width={'70px'} sx={{ transform: 'none' }} />
    ];

    return (
        <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8, display: 'flex', gap: 4, flexDirection: 'column' }} component={'article'}>
            <Breadcrumbs aria-label="breadcrumb">
                {breadcrumps}
            </Breadcrumbs>
            <Skeleton variant='text' sx={(theme) => { return { fontSize: theme.typography.h1, transform: 'none'  } }} width='60%' />
            <Stack direction={'row'} gap={4} justifyContent={'center'}>
                <ProductImageBlockSkeleton />
                <Stack sx={rightPageAreaStyles}>
                    {!downTablet &&
                        <ProductCharactersAndLinksSkeleton />
                    }
                    <Stack sx={ctaAreaStyles(downTablet)}>
                        <Stack sx={ctaStyles}>
                            <Stack direction={'row'} gap={2} justifyContent={'space-between'}>
                                <Skeleton variant='text' sx={(theme) => { return { fontSize: theme.typography.h3, width: '50%', transform: 'none' } }} />
                                <Skeleton variant='text' width={'50px'} sx={{ transform: 'none' }} />
                            </Stack>
                            <Stack direction={'row'} justifyContent={'space-between'} gap={2} alignItems={'center'}>
                                <Skeleton variant='rounded' sx={{ flex: '1' }} height={'50px'} />
                                <Skeleton variant='rounded' sx={{ height: '100%', aspectRatio: '1', width: '50px', transform: 'none' }} />
                            </Stack>
                        </Stack>
                        <Stack gap={1} width='100%' alignItems={'center'}>
                            <Skeleton variant='text' width={'70%'} sx={{ transform: 'none'}}/>
                            <Skeleton variant='text' width={'70%'} sx={{ transform: 'none' }} />
                            <Skeleton variant='text' width={'70%'} sx={{ transform: 'none' }} />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Skeleton variant='text' sx={(theme) => { return { fontSize: theme.typography.h2, transform: 'none', width: '30%' } }} />
            <ProductContentSkeleton />
        </Container>
    )
};

export default Product;