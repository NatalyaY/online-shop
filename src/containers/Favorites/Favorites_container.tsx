import React from 'react';
import Favorites from './../../components/Favorits/Favorites';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/user/userSlice';
import { selectFavorits } from '../../features/favorits/favoritsSlice';
import useProductsByID from './../../common/hooks/useProductsByID';
import { OverloadedReturnType } from '../../common/types';

export type products = OverloadedReturnType<typeof useProductsByID>;

const Favorites_container: React.FC<{}> = () => {

    const viewedProductIds = useSelector(selectUser).viewedProducts;

    const favorites = useSelector(selectFavorits).items;
    const products: products = useProductsByID(favorites as any);
    const viewedProducts: products = useProductsByID(viewedProductIds as any);


    return <Favorites products={products} viewedProducts={viewedProducts} />
}

export default Favorites_container;