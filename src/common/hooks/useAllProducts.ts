import React from 'react';
import { useAppDispatch, useAppSelector } from '../generics';
import { fetchAllProducts } from '../../features/products/productsSlice';


const useAllProducts = () => {
    const dispatch = useAppDispatch();
    const productsStatus = useAppSelector((state) => state.products.status);
    let isLoading = false;

    React.useEffect(() => {
        if (!isLoading && productsStatus != 'loading') {
            isLoading = true;
            dispatch(fetchAllProducts());
        };
    }, [])
};

export default useAllProducts;