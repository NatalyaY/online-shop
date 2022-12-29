import React from 'react';
import { Container } from '@mui/material';
import { viewedProducts, products, cartStatus, editUserData, createOrder, OrderContacts, clearError } from '../../containers/Cart/Cart_container';
import { ordersState, userState } from '../../common/types';
import CartList from './components/Stage1/CartList';
import CartForm from './components/Stage2/CartForm';
import CartTYP from './components/Stage3/CartTYP';
import NoProducts from './components/Stage1/NoProducts';

interface ICartProps {
    productsWithQty: products,
    viewedProducts: viewedProducts,
    cartStatus: cartStatus,
    editUserData: editUserData,
    createOrder: createOrder,
    user: userState,
    orders: ordersState,
    unsetUserError: clearError,
    unsetOrderError: clearError
};

type stage = 1 | 2 | 3;

export type setValidatedContacts = React.Dispatch<React.SetStateAction<OrderContacts | null>>

const Cart: React.FC<ICartProps> = ({ productsWithQty, viewedProducts, cartStatus, editUserData, createOrder, user, orders, unsetUserError, unsetOrderError }) => {

    const [productsToOrder, setProductsToOrder] = React.useState(productsWithQty);

    const [stage, setStage] = React.useState<stage>(1);

    return (
        <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8, display: 'flex', gap: 4, flexDirection: 'column' }} component={'article'}>
            {
                stage == 1 ?
                    productsWithQty.length &&
                    <CartList {...{ productsWithQty, setProductsToOrder, setStage, cartStatus }} />
                    ||
                    <NoProducts viewedProducts={viewedProducts} />
                    :
                    null
            }
            {
                stage == 2 &&
                <CartForm {...{ setStage, products: productsToOrder, user, editUserData, createOrder, orders, unsetUserError, unsetOrderError }} />
            }
            {
                stage == 3 &&
                <CartTYP {...{ orders, products: productsToOrder }} />
            }
        </Container >
    )
};

export default Cart;