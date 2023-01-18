import React from 'react';
import { ProductInState } from '../../../server/helpers';
import { useAppSelector } from '../../app/redux-hooks';
import useProductsQueryParam from './useProductsQueryParam';
import { selectProducts, fetchCustomProductsBulk, fetchCustomProducts } from './../../features/products/productsSlice';
import { useAppDispatch } from './../../app/redux-hooks';
import unify from './../helpers/unify';
import { queryParams } from '../types';
import compareObjects from '../helpers/compareObjects';

const getQueries = (product?: ProductInState) => {
    const reg = `^([A-ZА-Я][а-яa-z]+(\\-[а-яa-z]+)*)(\\s+[a-zа-я]+)*`;
    const searchTerm = product?.name.match(reg);

    const getMaxPrice = (product: ProductInState) => {
        const minDiffLevel = 100;
        const priceMultyplier = 0.3;

        if (product.salePrice * priceMultyplier >= minDiffLevel) {
            return product.salePrice + product.salePrice * priceMultyplier
        } else {
            return product.salePrice + minDiffLevel;
        };
    };

    let categoryID = product?.breadcrumps[product?.breadcrumps.length - 2].UUID || '';
    let parentCategory = product?.breadcrumps[1].UUID || '';
    let price = product ? `${product.salePrice * 0.5};${getMaxPrice(product)}` : '';

    const searchParam = searchTerm ? { s: searchTerm[0] } : {};

    const lightParams = { inStock: '1' as '1', category: categoryID };
    const mediumParams = { inStock: '1' as '1', category: parentCategory, ...searchParam };
    const paramsWOPrice = { ...mediumParams, category: categoryID };
    const maxMatchParams = { ...paramsWOPrice, price: price };

    const isMediumParamsNeeded = maxMatchParams.category !== product?.breadcrumps[1].UUID;
    const isLightParamsNeeded = product?.breadcrumps.length != 3;

    const params = [maxMatchParams, paramsWOPrice];
    if (isMediumParamsNeeded) params.push(mediumParams);
    if (isLightParamsNeeded) params.push(lightParams);

    const query = params.map(param => { return { params: param, limit: 50 } });

    return { params, query };
};

const useSimilar = (product?: ProductInState) => {
    const dispatch = useAppDispatch();

    const { params, query } = getQueries(product);

    const productsFromServer = useProductsQueryParam(params).filter((n): n is queryParams => n !== undefined);
    const productsFromState = useAppSelector((state) =>
        params.map(p =>
            selectProducts(state, p, false, false)
                .selectedProducts?.filter(p => p._id !== product?._id) || []
        )
    );

    const isFetched = productsFromServer.length == params.length;

    const similar = isFetched ? unify(...productsFromState).slice(0, 51) : new Array<null>(20).fill(null);

    React.useEffect(() => {
        if (!productsFromServer.length) {
            dispatch(fetchCustomProductsBulk(query));
            return;
        };
        if (productsFromServer.length != params.length) {
            const missingQueries = params.filter(param => productsFromServer.findIndex(p => compareObjects(p.params, param)) == -1);
            const bulkQuery = missingQueries.map(q => ({ params: q, limit: 50 }));
            if (missingQueries) {
                dispatch(fetchCustomProductsBulk(bulkQuery));
            };
        };
    }, [product?._id]);

    return similar;
};

export default useSimilar;