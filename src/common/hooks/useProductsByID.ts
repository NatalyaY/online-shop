import React from 'react';
import { useAppSelector } from "../../app/redux-hooks";
import { selectProductsByIDs } from "../../features/products/productsSlice";
import { useAppDispatch } from './../../app/redux-hooks';
import { fetchProductsByIDs } from './../../features/products/productsSlice';
import { ProductInState } from "../../../server/helpers";

type ObjectWithId = { id: string };

function isObjectWithId(item: any[]): item is ObjectWithId[] {
    return item.filter(i => i.id !== undefined).length == item.length;
}

function useProductsByID(productIds: string[]): (ProductInState | undefined)[]
function useProductsByID<T extends ObjectWithId>(productIds: T[]): (T & { product: ProductInState | undefined })[]
function useProductsByID(productIds: undefined): []
function useProductsByID(productIds: string[] | undefined | ObjectWithId[]) {

    const dispatch = useAppDispatch();

    const { products, idsToFetch } = useAppSelector((state) => {
        if (!productIds) {
            return { products: [], idsToFetch: [] };
        };
        if (isObjectWithId(productIds)) {
            const products = productIds.map(p => {
                const product = selectProductsByIDs(state, [p.id]);
                return { ...p, product: product[0] }
            });
            const resultsIds = products.map(pr => pr.product?._id);
            const idsToFetch = productIds.filter(p => !resultsIds.includes(p.id)).map(pr => pr.id);
            return { products, idsToFetch };
        } else {
            const products = selectProductsByIDs(state, productIds);
            const resultsIds = products.map(pr => pr?._id);
            const idsToFetch = productIds.filter(p => !resultsIds.includes(p));
            return { products, idsToFetch };
        };
    });

    React.useEffect(() => {
        if (idsToFetch.length) {
            dispatch(fetchProductsByIDs(idsToFetch));
        };
    }, []);

    return products;
};

export default useProductsByID;