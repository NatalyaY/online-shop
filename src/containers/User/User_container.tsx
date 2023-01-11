import React from 'react';
import User from '../../components/User/User';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/redux-hooks';
import { addUserFields, ChangePassword, logOut, removeUserFields, selectUser } from './../../features/user/userSlice';
import { selectOrdersState } from './../../features/orders/ordersSlice';
import { cartState, ordersState, OverloadedReturnType, UserChangePasswordFields, userState } from '../../common/types';
import { selectCart } from '../../features/cart/cartSlice';
import useProductsByID from './../../common/hooks/useProductsByID';
import { selectFavorits } from '../../features/favorits/favoritsSlice';
import { useNavigate } from 'react-router-dom';
import { EditUserMapped } from '../../../server/helpers';

type cartItems = NonNullable<cartState['items']>[number];
type favoritsItems = ReturnType<typeof selectFavorits>['items'];
type ordersItems = NonNullable<ordersState['orders']>[number]['items'][number];


export interface UserData {
    name?: userState['name'],
    email?: userState['email'],
    phone: userState['phone'],
    address?: userState['address']
};

export type editUserData = (fieldsToUpdate: EditUserMapped) => void;
export type removeUserData = (...args: (keyof UserData)[]) => void;
export type changePassword = (passwords: UserChangePasswordFields) => void;
export type Logout = () => void;

export type cartProducts = OverloadedReturnType<typeof useProductsByID<cartItems>, [cartItems[]]>
    | OverloadedReturnType<typeof useProductsByID, [undefined]>;
export type ordersProducts = OverloadedReturnType<typeof useProductsByID<ordersItems>, [ordersItems[]]>
    | OverloadedReturnType<typeof useProductsByID, [undefined]>;

export type favoritsProducts = OverloadedReturnType<typeof useProductsByID, [favoritsItems]>;


const User_container: React.FC<{}> = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useSelector(selectUser);

    const cart = useSelector(selectCart);
    const cartItems = cart.items;
    const cartProducts: cartProducts = useProductsByID<cartItems>(cartItems as any);

    const favorits = useSelector(selectFavorits);
    const favoritsItems = favorits.items;

    const favoritsProducts: favoritsProducts = useProductsByID(favoritsItems as any);

    const orders = useSelector(selectOrdersState);
    const ordersItems = orders.orders ? orders.orders.map(o => o.items).flat() : undefined;

    const ordersProducts: ordersProducts = useProductsByID<ordersItems>(ordersItems as any);

    const editUserData: editUserData = (fieldsToUpdate: EditUserMapped) => dispatch(addUserFields(fieldsToUpdate));
    const removeUserData: removeUserData = (...args: (keyof UserData)[]) => {
        const data = args.reduce<{ [k in typeof args[number]]?: '' }>((obj, arg) => {
            obj[arg] = '' as '';
            return obj;
        }, {});
        dispatch(removeUserFields(data))
    };

    const changePassword: changePassword = (passwords: UserChangePasswordFields) => dispatch(ChangePassword(passwords));
    const Logout: Logout = () => dispatch(logOut());


    if (user.state === 'unauthorized') {
        navigate("/");
        return null;
    };

    return <User {...{ user, cartProducts, favoritsProducts, orders, editUserData, removeUserData, ordersProducts, changePassword, Logout }} />
}

export default User_container;