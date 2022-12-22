import React from 'react';
import { ProductInState } from '../../../server/helpers';
import { useAppSelector, useAppDispatch } from '../../app/redux-hooks';
import useProductsQueryParam from './useProductsQueryParam';
import { selectProducts, fetchCustomProductsBulk } from '../../features/products/productsSlice';
import unify from './../helpers/unify';

const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    return array;
};

const useRecommended = (product?: ProductInState) => {
    const dispatch = useAppDispatch();

    const [totalResults, setTotalResults] = React.useState<ProductInState[] | null>(null);

    const categoryID: string = product?.breadcrumps[1].UUID || '';

    const popular = { inStock: '1' as '1', category: categoryID };
    const newIns = { inStock: '1' as '1', category: categoryID, sorting: 'new' as 'new' };
    const cheap = { inStock: '1' as '1', category: categoryID, sorting: 'price_desc' as 'price_desc' };

    const queries = [popular, newIns, cheap];

    const query = [{ params: popular, limit: 50 }, { params: newIns, limit: 50 }, { params: cheap, limit: 50 }];

    const products = useAppSelector((state) => {
        return queries.map(query => {
            return selectProducts(state, query, true, false).selectedProducts?.filter(p => p._id !== product?._id) || []
        })
    });

    const isFetched = (products.filter(p => p.length !== 0).length == queries.length);

    const recommended = isFetched && totalResults ? totalResults : new Array<null>(20).fill(null);

    React.useEffect(() => {
        if (!isFetched) {
            dispatch(fetchCustomProductsBulk(query));
        };
    }, [product?._id]);

    React.useEffect(() => {
        if (!isFetched) return;
        const res = unify(...products.map(list => list.slice(0, 51)));
        shuffle(res);
        setTotalResults(res);
    }, [isFetched]);

    return recommended;
};

export default useRecommended;