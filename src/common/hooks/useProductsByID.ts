import React from 'react';
import { useAppSelector } from "../../app/redux-hooks";
import { selectProductsByIDs } from "../../features/products/productsSlice";
import { useAppDispatch } from './../../app/redux-hooks';
import { fetchProductsByIDs } from './../../features/products/productsSlice';
import { ProductInState } from "../../../server/helpers";

function useProductsByID(productIds: string[]): (ProductInState | undefined)[]
function useProductsByID(productIds: undefined): []
function useProductsByID(productIds: string[] | undefined) {

    const dispatch = useAppDispatch();

    const products = useAppSelector((state) => selectProductsByIDs(state, productIds || []));

    if (!productIds) return [];
    const filteredProducts = products.filter(prod => prod !== undefined) as NonNullable<typeof products[number]>[];

    React.useEffect(() => {
        if (filteredProducts.length !== productIds.length) {
            const idsToFetch = productIds.filter(id => !filteredProducts.map(prod => prod._id).includes(id));
            dispatch(fetchProductsByIDs(idsToFetch));
        };
    }, []);

    return products;
};

export default useProductsByID;