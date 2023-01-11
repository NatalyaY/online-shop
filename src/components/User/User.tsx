import React from 'react';
import { Container } from '@mui/material';
import { cartProducts, favoritsProducts, ordersProducts, removeUserData, editUserData, changePassword, Logout } from '../../containers/User/User_container';
import { ordersState, userState } from '../../common/types';

import { useMatches } from 'react-router-dom';
import UserMain from './components/UserMain';
import UserOrders from './components/UserOrders';
import UserDetails from './components/UserDetails';

interface IUserProps {
    user: userState,
    cartProducts: cartProducts,
    favoritsProducts: favoritsProducts,
    ordersProducts: ordersProducts,
    orders: ordersState,
    editUserData: editUserData,
    removeUserData: removeUserData,
    changePassword: changePassword,
    Logout: Logout
};

export interface IUserMainProps extends Omit<IUserProps, 'editUserData' | 'removeUserData' | 'changePassword' | 'Logout'> { };

const User: React.FC<IUserProps> =
    ({
        user,
        cartProducts,
        favoritsProducts,
        orders,
        editUserData,
        removeUserData,
        ordersProducts,
        changePassword,
        Logout
    }) => {

        const matches = useMatches();
        const splitted = matches[1].pathname.split('/');
        const part = splitted.length == 2 ? null : splitted[splitted.length - 1];

        return (
            <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8, display: 'flex', gap: 4, flexWrap: 'wrap' }} component={'article'}>
                {
                    part == null &&
                    <UserMain {...{ user, cartProducts, favoritsProducts, orders, ordersProducts }} />
                }
                {
                    part == 'orders' &&
                    <UserOrders {...{ orders, ordersProducts }} />
                }
                {
                    part == 'details' &&
                    <UserDetails {...{ user, editUserData, removeUserData, changePassword, Logout }} />
                }
            </Container>
        )
    };

export default User;