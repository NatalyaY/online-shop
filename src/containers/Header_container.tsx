import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser, SignUp, Login, logOut } from '../features/user/userSlice';
import { selectFavorits } from '../features/favorits/favoritsSlice';
import { selectCart } from '../features/cart/cartSlice';
import { selectBrands } from '../features/brands/brandsSlice';

import { useAppDispatch } from '../common/generics';
import Product from '../../server/db/models/product';


import Header from '../components/Header';

export type user = ReturnType<typeof selectUser>;
export type favorits = ReturnType<typeof selectFavorits>;
export type cart = ReturnType<typeof selectCart>;
export type brands = ReturnType<typeof selectBrands>;


type LoginParams = Parameters<typeof Login>[number];
type SignUpParams = Parameters<typeof SignUp>[number];

export type Login = ({ phone, password }: LoginParams) => void;
export type SignUp = ({ phone, password }: SignUpParams) => void;
export type LogOut = () => void;

export type GetAutocompleteProducts = (s: string) => Promise<Product[] | null>;




const Header_container = () => {
    const user = useSelector(selectUser);
    const favorits = useSelector(selectFavorits);
    const cart = useSelector(selectCart);
    const brands = useSelector(selectBrands);

    const dispatch = useAppDispatch();
    const LoginFN: Login = ({ phone, password }) => dispatch(Login({ phone, password }));
    const SignUpFN: SignUp = ({ phone, password }) => dispatch(SignUp({ phone, password }));
    const LogOutFN: LogOut = () => dispatch(logOut());


    const GetAutocompleteProducts: GetAutocompleteProducts = async (s) => {
        const products: Product[] = await (await fetch(`/api/products/autocomplete?s=${s}`)).json();
        return products.length ? products : null;
    };

    return <Header
        user={user}
        favorits={favorits}
        cart={cart}
        Login={LoginFN}
        SignUp={SignUpFN}
        brands={brands}
        GetAutocompleteProducts={GetAutocompleteProducts}
        LogOut={LogOutFN}
    />
};

export default Header_container;