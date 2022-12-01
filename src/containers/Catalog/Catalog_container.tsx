import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import NotFound from '../../components/NotFound/NotFound';

import { useAppSelector, useAppDispatch } from '../../app/redux-hooks';
import { selectProducts, fetchSomeProducts } from '../../features/products/productsSlice';
import Catalog from '../../components/Catalog/Catalog';
import { translitBrand } from './../../common/helpers/translitBrand';
import { filterActions, selectFilters } from '../../features/filters/filtersSlice';


const Catalog_container = () => {
    const dispatch = useAppDispatch();
    const CAT_REG = /cat-(?<category>([^\/]+?))-(.*)\/?/i;

    const { brand: brandName, category: categorySlug, '*': slag } = useParams();
    const [slug, id] = categorySlug?.split('-') || [];
    const categoryID = slug == 'cat' ? id : slag?.match(CAT_REG)?.groups?.category || undefined;

    const [search] = useSearchParams();
    const searchParams = Object.fromEntries(search.entries());

    const params = { ...(categoryID && { category: categoryID }), ...(brandName && { brand: brandName }), ...searchParams };

    const productsQty = useAppSelector((state) => state.products.qty);
    const queryParams = useAppSelector((state) => state.products.queryParams);
    const productsQueryParam = queryParams?.find(p => {
        return JSON.stringify(Object.fromEntries(Object.entries(p.params).map(e => [e[0], "" + e[1]]).sort())) ==
            JSON.stringify(Object.fromEntries(Object.entries(params).map(e => [e[0], "" + e[1]]).sort()))
    });

    const category = useAppSelector((state) => state.categories.find(c => c.UUID == categoryID));
    const brand = useAppSelector((state) => state.brands.find(b => translitBrand(b.text) == brandName));
    const { selectedProducts, qty} = useSelector(selectProducts);
    const filteredProductsQty = productsQueryParam ? productsQueryParam.qty : qty;

    const filter = useSelector(selectFilters);

    React.useEffect(() => {
        if (!productsQueryParam && productsQty !== undefined) {
            dispatch(fetchSomeProducts());
        };
    }, [categoryID, brandName]);

    React.useEffect(() => {
        dispatch(filterActions.clearFilters());
        dispatch(filterActions.setFilters(params));
    }, [categoryID, brandName]);

    return (
        (brand || category) &&
        <Catalog
            key={JSON.stringify(params)}
            products={selectedProducts}
            category={category}
            brand={brand}
            qty={filteredProductsQty}
            filter={filter}
        />
        ||
        <NotFound />
    )
};

export default Catalog_container;