import React from 'react';
import { useSelector } from 'react-redux';
import { addUserFields, clearUserError, selectUser } from '../../features/user/userSlice';
import useProductsByID from '../../common/hooks/useProductsByID';
import { cartState, OverloadedReturnType, userState, NewOrder } from '../../common/types';
import { selectCart } from '../../features/cart/cartSlice';
import { clearOrdersError, CreateOrder, selectOrdersState } from '../../features/orders/ordersSlice';

import Cart from './../../components/Cart/Cart';
import { useAppDispatch } from '../../app/redux-hooks';

type cartItems = NonNullable<cartState['items']>[number];
type viewedItems = ReturnType<typeof selectUser>['viewedProducts'];

export type viewedProducts = OverloadedReturnType<typeof useProductsByID, [viewedItems]>;
export type products = OverloadedReturnType<typeof useProductsByID<cartItems>, [cartItems[]]> | OverloadedReturnType<typeof useProductsByID, [undefined]>;
export type cartStatus = { status: cartState['status'], lastId: cartState['lastUpdatedId'] };

export type itemWithexistingProduct = products[number] & { product: NonNullable<products[number]['product']> }

export interface UserData {
    name?: userState['name'],
    email?: userState['email'],
    phone: userState['phone'],
    address?: userState['address']
};

export type editUserData = (fieldsToUpdate: UserData) => void;
export type createOrder = (order: NewOrder) => void;

export type OrderContacts = NewOrder['contacts'];

export type clearError = () => ReturnType<typeof clearOrdersError>


const Cart_container: React.FC = () => {
    const dispatch = useAppDispatch();

    const user = useSelector(selectUser);

    const orders = useSelector(selectOrdersState);

    const editUserData = (fieldsToUpdate: UserData) => dispatch(addUserFields(fieldsToUpdate));
    const unsetUserError = () => dispatch(clearUserError());
    const unsetOrderError = () => dispatch(clearOrdersError());

    const createOrder: createOrder = (order: NewOrder) => dispatch(CreateOrder(order));

    const cart = useSelector(selectCart);
    const cartItems = cart.items;
    const cartStatus = { status: cart.status, lastId: cart.lastUpdatedId };
    const products: products = useProductsByID<NonNullable<typeof cartItems>[number]>(cartItems as any);
    const viewedProducts: viewedProducts = useProductsByID(user.viewedProducts as any);

    const props = {
        productsWithQty: products,
        viewedProducts,
        cartStatus,
        user,
        orders,
        editUserData,
        createOrder,
        unsetUserError,
        unsetOrderError
    }

    return <Cart {...props} />
}

export default Cart_container;