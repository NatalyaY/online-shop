import { useAppSelector } from "../../app/redux-hooks";
import { selectProductsByIDs } from "../../features/products/productsSlice";
import  React  from 'react';
import { useAppDispatch } from './../../app/redux-hooks';
import { fetchProductsByIDs } from './../../features/products/productsSlice';


const useProductsByID = (productIds: string[]) => {
    const dispatch = useAppDispatch();

    const products = useAppSelector((state) => selectProductsByIDs(state, productIds));

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