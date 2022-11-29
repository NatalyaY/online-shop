import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/redux-hooks';
import FeaturedProducts from '../../components/Home/components/FeaturedProducts';
import { selectProductsByIDs, fetchProductsByIDs } from '../../features/products/productsSlice';


export type products = ReturnType<typeof selectProductsByIDs>;


const FeaturedProducts_container = () => {
    const dispatch = useAppDispatch();

    const productIds = [
        '635a8f4f8cb47f8d76d4f614',
        '635a8f4c8cb47f8d76d4e05e',
        '635a8f4d8cb47f8d76d4e254',
        '635a8f4f8cb47f8d76d4fc0a',
        '635a8f4d8cb47f8d76d4e0de',
        '635a8f4c8cb47f8d76d4d5fc',
        '635a8f4d8cb47f8d76d4e256',
        '635a8f4a8cb47f8d76d4d257',
        '635a8f4f8cb47f8d76d4fb18',
        '635a8f4a8cb47f8d76d4d291',
        '635a8f4f8cb47f8d76d4fc08',
        '635a8f4f8cb47f8d76d4f89d',
        '635a8f4a8cb47f8d76d4d409',
        '635a8f4a8cb47f8d76d4d3b0',
        '635a8f4a8cb47f8d76d4d38d',
        '635a8f508cb47f8d76d4fc40',
        '635a8f4e8cb47f8d76d4ee18',
        '635a8f4f8cb47f8d76d4fb5d',
        '635a8f4c8cb47f8d76d4e0d2',
        '635a8f4a8cb47f8d76d4d2d7',
        '635a8f4a8cb47f8d76d4d4c8',
        '635a8f508cb47f8d76d4fe05',
        '635a8f4f8cb47f8d76d4fb27',
        '635a8f508cb47f8d76d4fe06',
        '635a8f4c8cb47f8d76d4d59e',
        '635a8f4c8cb47f8d76d4d62d',
        '635a8f4c8cb47f8d76d4dc48',
        '635a8f4c8cb47f8d76d4ded9',
        '635a8f4c8cb47f8d76d4d83b',
        '635a8f4d8cb47f8d76d4e6db',
        '635a8f4a8cb47f8d76d4d415',
        '635a8f4f8cb47f8d76d4fad1',
        '635a8f4a8cb47f8d76d4d368',
        '635a8f4c8cb47f8d76d4d886',
        '635a8f4a8cb47f8d76d4d47b',
        '635a8f4c8cb47f8d76d4d8f2',
        '635a8f4a8cb47f8d76d4d188',
        '635a8f4d8cb47f8d76d4e198',
        '635a8f508cb47f8d76d4fdc0',
        '635a8f508cb47f8d76d4fcb9',
        '635a8f508cb47f8d76d4fdc6'
    ];

    const products = useAppSelector((state) => selectProductsByIDs(state, productIds));

    const filteredProducts = products.filter(prod => prod !== undefined) as NonNullable<typeof products[number]>[];

    React.useEffect(() => {
        if (filteredProducts.length !== productIds.length) {
            const idsToFetch = productIds.filter(id => !filteredProducts.map(prod => prod._id).includes(id));
            dispatch(fetchProductsByIDs(idsToFetch));
        };
    }, []);

    return <FeaturedProducts products={products} />
};

export default FeaturedProducts_container;