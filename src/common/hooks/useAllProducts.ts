import React from 'react';
import { fetchAllProducts } from '../../features/products/productsSlice';
import { useAppDispatch, useAppSelector } from './../../app/redux-hooks';


const useAllProducts = () => {
    const dispatch = useAppDispatch();
    const productsStatus = useAppSelector((state) => state.products.status);

    React.useEffect(() => {
        if (productsStatus != 'loading') {
            dispatch(fetchAllProducts());
        };
    }, [])
};

export default useAllProducts;