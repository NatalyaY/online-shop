import React from 'react';

import { Typography, Stack, Button, Skeleton, Divider, Link, Box } from '@mui/material';
import useProductActions from '../../../../common/hooks/useProductActions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '../../../../app/redux-hooks';
import { addToCart } from '../../../../features/cart/cartSlice';
import { useDebouncedFunction, useDebouncedFunctionwithState } from '../../../../common/hooks/useWindowWidth';
import { products } from '../../../../containers/Cart/Cart_container';

interface IProductInCartProps {
    productWithQty: products[number];
    setProductTempQty: (productWithQty: products[number]) => void;
};

const productActionsStyles = {
    textTransform: 'none',
    py: 0,
    px: 1,
    minWidth: 0,
    fontSize: '0.775rem',
    fontWeight: 400,
    whiteSpace: 'nowrap'
};

const addtoFavoritesStyles = {
    ...productActionsStyles,
    color: '#dc416d',
};

const deleteBtnStyles = {
    ...productActionsStyles,
    color: 'text.primary',
};

const qtyBtnsStyles = {
    border: '1px solid',
    p: 0,
    aspectRatio: '1',
    borderRadius: '50%',
    zIndex: '6',
    minWidth: '40px'
};

function getPseudoStyles(content: string) {
    return {
        position: 'relative',
        textAlign: 'center',
        '&:before': {
            content: '"' + content + '"',
            display: 'block',
            height: 0,
            visibility: 'hidden',
        }
    };
};

const ProductInCart: React.FC<IProductInCartProps> = ({ productWithQty, setProductTempQty }) => {
    const { product, qty } = productWithQty;
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const { handleAddToCart, handleAddToFavorites, isAddedToFavorites } = useProductActions(product?._id || '');
    const [tempQty, setTempQty] = React.useState(qty);

    const maxQty = product ? Math.min(20, product.amount) : 20;

    function getFavoriteBtn() {
        if (isDesktop) {
            return isAddedToFavorites ? 'В избранном' : 'Добавить в избранное';
        } else {
            return isAddedToFavorites ?
                <FavoriteRoundedIcon />
                :
                <FavoriteBorderRoundedIcon />;
        };
    };

    const productLink = product?.breadcrumps[product?.breadcrumps.length - 1].link;

    const salePriceStyles = product && {
        fontSize: { xs: '1.2rem', md: '1.5rem' },
        fontWeight: 600,
        whiteSpace: 'nowrap',
        ...getPseudoStyles((maxQty * product.salePrice * product.amount).toLocaleString('ru-RU') + ' ₽')
    };

    const priceStyles = product && {
        whiteSpace: 'nowrap',
        fontSize: '1rem',
        color: 'secondary.light',
        textDecoration: 'line-through',
        textDecorationColor: '#dc416d',
        ...getPseudoStyles((maxQty * product.price * product.amount).toLocaleString('ru-RU') + ' ₽')
    };

    const discountStyles = product && {
        color: '#dc416d',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        ...getPseudoStyles('Скидка ' + ((product.price - product.salePrice) * maxQty).toLocaleString('ru-RU') + ' ₽')
    };

    function addQtyToDB() {
        if (tempQty >= maxQty || !product)
            return;
        dispatch(addToCart({ id: product._id, qty: tempQty + 1 }));
    };

    function addQtyTemp() {
        if (tempQty >= maxQty || !product) return;
        setProductTempQty({ ...productWithQty, qty: tempQty + 1 });
        setTempQty(tempQty + 1);
    };

    function subtractQtyToDB() {
        if (tempQty <= 1 || !product)
            return;
        dispatch(addToCart({ id: product._id, qty: tempQty - 1 }));
    };

    function subtractQtyTemp() {
        if (tempQty <= 1 || !product) return;
        setProductTempQty({ ...productWithQty, qty: tempQty - 1 });
        setTempQty(tempQty - 1);
    };

    const debouncedAdd = useDebouncedFunctionwithState(addQtyToDB, 500);
    const debouncedSubtract = useDebouncedFunctionwithState(subtractQtyToDB, 500);

    function add(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        debouncedAdd();
        addQtyTemp();
    };

    function subtract(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        debouncedSubtract();
        subtractQtyTemp();
    };

    React.useEffect(() => {
        if (tempQty !== qty) {
            setTempQty(qty);
        };
    }, [qty]);

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4, width: '100%' }}>
            {product &&
                <>
                    <Stack direction={'row'} gap={2}>
                        <Link href={productLink} flex={'0'} className='woUnderline'>
                            <img src={`/img/products/${product._id}/100/${0}.webp`} style={{ objectFit: 'contain' }} />
                        </Link>
                        <Stack justifyContent={'space-between'}>
                            <Link href={productLink} className='woUnderline' display={'flex'} sx={{ flexDirection: 'column' }}>
                                <Typography variant='h6'>{product.name}</Typography>
                                <Typography sx={{ color: 'secondary.light' }}>{product.brand}</Typography>
                            </Link>
                            <Stack direction={'row'} mt={2} gap={1} sx={{ fontWeight: 400 }}>
                                <Button variant='text' onClick={handleAddToFavorites} sx={addtoFavoritesStyles}>
                                    {getFavoriteBtn()}
                                </Button>
                                <Divider orientation='vertical' />
                                <Button variant='text' onClick={handleAddToCart} sx={deleteBtnStyles}>
                                    {isDesktop ? 'Удалить' : <DeleteIcon />}
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} gap={1} flexWrap={'wrap-reverse'} alignItems={'flex-end'} justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                        <Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'flex-end'}>
                            <Button sx={qtyBtnsStyles} disabled={tempQty <= 1} onClick={subtract}>-</Button>
                            <Typography component={'span'} sx={getPseudoStyles("" + maxQty)}>
                                {tempQty}
                            </Typography>
                            <Button sx={qtyBtnsStyles} disabled={tempQty >= maxQty} onClick={add}>+</Button>
                        </Stack>
                        <Stack flex={'1'} alignItems={{ xs: 'center', sm: 'flex-end' }} sx={{ minWidth: '190px' }}>
                            <Stack direction={'row'} alignItems={'center'}>
                                <Typography sx={salePriceStyles}>
                                    {`${(product.salePrice * tempQty).toLocaleString('ru-RU')} ₽`}
                                </Typography>
                                {
                                    product.price !== product.salePrice &&
                                    <Typography sx={priceStyles}>
                                        {`${(product.price * tempQty).toLocaleString('ru-RU')} ₽`}
                                    </Typography>
                                }
                            </Stack>
                            {
                                product.price !== product.salePrice &&
                                <Typography sx={discountStyles}>
                                    {`Скидка ${((product.price - product.salePrice) * tempQty).toLocaleString('ru-RU')} ₽`}
                                </Typography>
                            }
                        </Stack>
                    </Stack>
                </>
                ||
                <ProductInCartSkeleton />
            }
        </Box>
    );
};

const ProductInCartSkeleton: React.FC = () => {
    return (
        <>
            <Stack direction={'row'} gap={2}>
                <Skeleton variant='rectangular' width={'100px'} height={'100px'} sx={{ transform: 'none' }} />
                <Stack justifyContent={'space-between'} width={'100%'} flex={1}>
                    <Stack gap={1}>
                        <Skeleton variant='text' sx={(theme) => { return { fontSize: theme.typography.h6, transform: 'none' }; }} />
                        <Skeleton variant='text' sx={(theme) => { return { fontSize: theme.typography.h6, transform: 'none' }; }} />
                        <Skeleton variant='text' sx={{ transform: 'none', width: '50%' }} />
                    </Stack>
                    <Stack direction={'row'} mt={2} gap={1}>
                        <Skeleton variant='text' sx={{ transform: 'none', flex: '1', ...addtoFavoritesStyles }} />
                        <Divider orientation='vertical' />
                        <Skeleton variant='text' sx={{ transform: 'none', flex: '1', ...deleteBtnStyles }} />
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction={'row'} gap={1} flexWrap={'wrap-reverse'} alignItems={'flex-end'} justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                <Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'flex-end'}>
                    <Skeleton variant='circular' sx={{ width: '40px', height: '40px', transform: 'none' }} />
                    <Skeleton variant='text' sx={{ transform: 'none', width: '20px' }} />
                    <Skeleton variant='circular' sx={{ width: '40px', height: '40px', transform: 'none' }} />
                </Stack>
                <Stack flex={'1'} alignItems={{ xs: 'center', sm: 'flex-end' }} sx={{ minWidth: '180px' }} gap={1}>
                    <Stack direction={'row'} alignItems={'center'} gap={4}>
                        <Skeleton variant='text' sx={{ transform: 'none', width: '70px', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                        <Skeleton variant='text' sx={{ transform: 'none', width: '70px', fontSize: '1rem', }} />
                    </Stack>
                    <Skeleton variant='text' sx={{ transform: 'none', width: '100px' }} />
                </Stack>
            </Stack>
        </>
    )
}

export default ProductInCart;
