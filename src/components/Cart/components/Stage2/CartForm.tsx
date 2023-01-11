import React from 'react';
import { Typography, Stack, Paper, Button } from '@mui/material';
import { products, editUserData, createOrder, OrderContacts, itemWithexistingProduct, clearError } from '../../../../containers/Cart/Cart_container';
import Summary from '../Summary';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { ordersState, userState } from '../../../../common/types';
import CheckoutForm from './CheckoutForm';

interface ICartFormProps {
    products: Exclude<products, []>,
    setStage: React.Dispatch<React.SetStateAction<2 | 1 | 3>>,
    user: userState,
    editUserData: editUserData,
    createOrder: createOrder,
    orders: ordersState,
    unsetUserError: clearError,
    unsetOrderError: clearError
};

const CartForm: React.FC<ICartFormProps> = ({ products, setStage, user, editUserData, createOrder, orders, unsetUserError, unsetOrderError }) => {
    const [formIsValid, setFormIsValid] = React.useState(false);
    const [validatedContacts, setValidatedContacts] = React.useState<OrderContacts | null>(null);

    const userData = { name: user.name, email: user.email, phone: user.phone, address: user.address };

    const isSummaryBtnLoading = user.status == 'loading' || orders.status == 'loading';
    let isSummaryBtnDisabled = !formIsValid;

    function handleSummaryBtnClick() {
        if (formIsValid && validatedContacts) {
            updateUserDataOrSendOrder(validatedContacts);
        };
    };

    const updateUserDataOrSendOrder = (contacts: NonNullable<typeof validatedContacts>) => {
        if (user.state == 'authorized') {
            const newContacts = { ...contacts };

            Object.entries(newContacts).forEach(entry => {
                const [k, v] = entry;
                if (v == '' || v == userData[k as keyof typeof userData]) {
                    delete newContacts[k as keyof typeof newContacts];
                };
            });

            if (Object.keys(newContacts).length) {
                editUserData(newContacts);
                return;
            };
        };
        sendOrder();
    };

    const sendOrder = () => {
        if (!validatedContacts || !formIsValid) return;
        const emptyProducts = products.filter(p => p.product == undefined).length !== 0;

        if (!emptyProducts) {
            const items = (products as itemWithexistingProduct[]).map(p => {
                const { id, qty, product: { price, salePrice, discount } } = p;
                return { id, qty, price, salePrice, discount };
            });
            const totalPrice = items.reduce((totalPrice, item) => totalPrice + item.price * item.qty, 0);
            const totalSalePrice = items.reduce((totalSalePrice, item) => totalSalePrice + item.salePrice * item.qty, 0);
            const totalDiscount = totalPrice - totalSalePrice;

            createOrder({ items, contacts: validatedContacts, totalPrice, totalSalePrice, totalDiscount });
        };
    };

    function handleClick() { setStage(1) };

    React.useEffect(() => {
        if (user.status == 'succeeded' && validatedContacts && formIsValid) {
            sendOrder();
        };
    }, [user.status]);

    React.useEffect(() => {
        if (orders.status == 'succeeded' && formIsValid) {
            setStage(3);
        };
    }, [orders.status]);

    React.useEffect(() => {
        return () => {
            user.error && unsetUserError();
            orders.error && unsetOrderError();
        };
    }, [user.error, orders.error]);

    return (
        <>
            <Typography variant="h1" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                Оформление заказа
            </Typography>
            <Button sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 'fit-content' }} onClick={handleClick}>
                <ArrowBackIosRoundedIcon />
                Вернуться в корзину
            </Button>
            <Stack direction={'row'} gap={4} flexWrap={{ xs: 'wrap', lg: 'nowrap' }} alignItems={'flex-start'}>
                <Paper sx={{ p: 4, flex: '3 1 400px' }}>
                    <CheckoutForm userData={userData} setIsValid={setFormIsValid} setValidatedContacts={setValidatedContacts} error={user.error} />
                </Paper>
                <Paper sx={{ p: 4, flex: '1 1 350px', position: 'sticky', top: document.querySelector('header')?.clientHeight || 0 }}>
                    <Summary
                        {...{
                            products,
                            stage: 2,
                            handleSummaryBtnClick,
                            isDisabled: isSummaryBtnDisabled,
                            isLoading: isSummaryBtnLoading,
                            error: orders.error
                        }} />
                </Paper>
            </Stack>
        </>
    );
};

export default CartForm;

