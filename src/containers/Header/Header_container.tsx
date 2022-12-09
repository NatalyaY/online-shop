import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser, SignUp, Login, logOut } from '../../features/user/userSlice';
import { selectFavorits } from '../../features/favorits/favoritsSlice';
import { selectCart } from '../../features/cart/cartSlice';
import { selectBrands } from '../../features/brands/brandsSlice';
import { ProductInState } from '../../../server/helpers';

import { useAppDispatch } from './../../app/redux-hooks';
import Header from '../../components/Header/Header';

export type user = ReturnType<typeof selectUser>;
export type favorits = ReturnType<typeof selectFavorits>;
export type cart = ReturnType<typeof selectCart>;
export type brands = ReturnType<typeof selectBrands>;
export type Products = ProductInState[];


type LoginParams = Parameters<typeof Login>[number];
type SignUpParams = Parameters<typeof SignUp>[number];

export type Login = ({ phone, password }: LoginParams) => void;
export type SignUp = ({ phone, password }: SignUpParams) => void;
export type LogOut = () => void;


export type GetAutocompleteProducts = (s: string) => Promise<{ products: Products | undefined, hints: ReturnType<typeof getMappedHints> | undefined, aborted: boolean  }>;

const getMappedHints = (hints: string[], searchValue: string) => {
    return hints.map(hint => {
        const index = hint.indexOf(searchValue);
        const hintSpans: { text: string, bold: boolean }[] = [];
        if (index == -1) {
            hintSpans.push({ text: hint, bold: false });
        } else if (index == 0) {
            hintSpans.push({ text: searchValue, bold: true });
            hintSpans.push({ text: hint.slice(index + searchValue.length), bold: false });
        } else {
            hintSpans.push({ text: hint.slice(0, index), bold: false });
            if (index == hint.length - searchValue.length) {
                hintSpans.push({ text: searchValue, bold: true });
            } else {
                hintSpans.push({ text: searchValue, bold: true });
                hintSpans.push({ text: hint.slice(index + searchValue.length), bold: false });
            };
        };
        return { hintSpans, hint };
    });
};

const Header_container = () => {
    const user = useSelector(selectUser);
    const favorits = useSelector(selectFavorits);
    const cart = useSelector(selectCart);
    const brands = useSelector(selectBrands);

    const dispatch = useAppDispatch();
    const LoginFN: Login = ({ phone, password }) => dispatch(Login({ phone, password }));
    const SignUpFN: SignUp = ({ phone, password }) => dispatch(SignUp({ phone, password }));
    const LogOutFN: LogOut = () => dispatch(logOut());

    let controller = new AbortController();

    const GetAutocompleteProducts: GetAutocompleteProducts = async (s) => {
        controller.abort();
        controller = new AbortController();
        try {
            const { products, hints }: { products?: Products, hints?: string[] } = await (await fetch(`/api/products/autocomplete?s=${s}`, { signal: controller.signal })).json();
            return { products: products?.length ? products : undefined, hints: hints?.length ? getMappedHints(hints, s) : undefined, aborted: false };
        } catch (error) {
            return { products: undefined, hints: undefined, aborted: true }
        }
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