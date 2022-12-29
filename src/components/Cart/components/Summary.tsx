import React from 'react';
import { Typography, Stack, Skeleton, Divider } from '@mui/material';
import { products } from '../../../containers/Cart/Cart_container';
import getCorrectTextEndings from '../../../common/helpers/getCorrectTextEndings';
import LoadingButton from '@mui/lab/LoadingButton';
import { ordersState } from '../../../common/types';
import  Fade  from '@mui/material/Fade';
import { Alert } from '@mui/lab';

interface ISummaryProps {
    products: Exclude<products, []>,
    stage: 1 | 2,
    handleSummaryBtnClick: () => void,
    isDisabled: boolean,
    isLoading: boolean,
    error?: ordersState['error']
};

const Summary: React.FC<ISummaryProps> = ({ products, stage, handleSummaryBtnClick, isDisabled, isLoading, error }) => {
    const emptyProducts = products.filter(p => p.product == undefined).length !== 0;

    const productsQty = products.reduce((total, cur) => total + cur.qty, 0);

    let totalPrice = products.reduce((total, cur) => {
        return total + cur.qty * (cur.product?.price || 0);
    }, 0);

    let totalDiscount = products.reduce((total, cur) => {
        const productDiscount = (cur.product?.price || 0) - (cur.product?.salePrice || 0);
        return total + cur.qty * productDiscount;
    }, 0);

    if (emptyProducts) {
        totalPrice = 0;
        totalDiscount = 0;
    };

    const productsText = getCorrectTextEndings({ qty: productsQty, textsArr: ['товар', 'товара', 'товаров'] });

    const buttonText = stage == 1 ? 'Перейти к оформлению' : 'Оформить заказ';

    return (
        <Stack gap={2}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                <Typography variant='h2'>Ваша корзина</Typography>
                <Typography sx={{ color: 'secondary.light', textAlign: 'center' }}>{`${productsQty} ${productsText}`}</Typography>
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                <Typography>{`Товары (${productsQty})`}</Typography>
                {totalPrice > 0 &&
                    <Typography sx={{ fontWeight: 600 }}>{`${totalPrice.toLocaleString('ru-RU')} ₽`}</Typography>
                    ||
                    <Skeleton variant='text' sx={{ fontWeight: 600, transform: 'none' }} width={'70px'}></Skeleton>}
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                <Typography>Скидка</Typography>
                {totalDiscount > 0 &&
                    <Typography sx={{ fontWeight: 600, color: '#dc416d' }}>{`- ${totalDiscount.toLocaleString('ru-RU')} ₽`}</Typography>
                    ||
                    <Skeleton variant='text' sx={{ fontWeight: 600, color: '#dc416d', transform: 'none' }} width={'70px'}></Skeleton>}
            </Stack>
            <Divider />
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                <Typography variant='h4' sx={{ fontWeight: 600 }}>Общая стоимость</Typography>
                {totalPrice > 0 &&
                    <Typography sx={{ fontWeight: 600, fontSize: '1.5rem', whiteSpace: 'nowrap' }}>{`${(totalPrice - totalDiscount).toLocaleString('ru-RU')} ₽`}</Typography>
                    ||
                    <Skeleton variant='text' sx={{ fontWeight: 600, fontSize: '1.5rem', transform: 'none' }} width={'70px'}></Skeleton>}
            </Stack>
            <LoadingButton variant='contained' onClick={handleSummaryBtnClick} loading={isLoading} disabled={isDisabled} sx={{ py: 2, mt: 2 }}>
                {buttonText}
            </LoadingButton>
            {error &&
                <Fade in={true}>
                    <Alert severity="error" sx={{ flexBasis: '100%' }}>
                        {error}
                    </Alert>
                </Fade>
            }
        </Stack>
    );
};

export default Summary;
