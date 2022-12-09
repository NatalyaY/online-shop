import React from 'react';
import { useSelector } from 'react-redux';
import NotFound from '../../components/NotFound/NotFound';

import { useAppSelector, useAppDispatch } from '../../app/redux-hooks';
import { selectProducts, fetchSomeProducts } from '../../features/products/productsSlice';
import Catalog from '../../components/Catalog/Catalog';
import { translitBrand } from './../../common/helpers/translitBrand';
import { filterActions, selectFilters } from '../../features/filters/filtersSlice';
import getCategoryParentIds from '../../common/helpers/getCategoryParentIds';
import { selectCategories } from '../../features/categories/categoriesSlice';
import useParamsFromUrl from './../../common/hooks/useParamsFromUrl';
import useProductsQueryParam from './../../common/hooks/useProductsQueryParam';
import { BrandInState, CategoryInState } from '../../../server/helpers';
import { selectBrands } from '../../features/brands/brandsSlice';
import compareObjects from './../../common/helpers/compareObjects';
import { filtersState } from '../../common/types';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';

export type filter = {
    minPrice?: number | null,
    maxPrice?: number | null,
    productsBrands?: BrandInState[] | null,
    productsCategories?: CategoryInState[] | null,
    availableBrands?: BrandInState[] | null,
    inStock?: '1',
    brand?: filtersState['brand'],
    s?: string
};

export type sorting = NonNullable<filtersState['sorting']>;
export type filterActions = typeof filterActions;
export type price = filtersState['price'];
export type setFilter = (value: Parameters<(typeof filterActions)['setFilters']>[number]) => void;
export type clearFilter = (value: Parameters<(typeof filterActions)['clearSomeFilters']>[number]) => void;

interface Props {
    productsParamsFromServer: ReturnType<typeof useProductsQueryParam>,
    productsParamsFromFrontend: ReturnType<typeof selectProducts>
};

interface SetSearchParamsProps {
    filters: filtersState,
    brandName?: string,
    searchParamsWOCategory: Omit<filtersState, 'category'>,
    setSearch: ReturnType<typeof useSearchParams>[1]
};

const useFilter = ({ productsParamsFromServer, productsParamsFromFrontend }: Props) => {

    const { inStock, brand, s } = useSelector(selectFilters);
    const categories = useSelector(selectCategories);
    const brands = useSelector(selectBrands);

    if (productsParamsFromServer) {
        productsParamsFromServer.productsCategories = [...new Set(productsParamsFromServer.productsCategories.map(cat => getCategoryParentIds(cat, categories)).flat())];
    };

    const getCategoriesByIds = (ids: string[] | null = null) => {
        if (!ids) return null;
        return ids
            .map(id => categories.find(c => c.UUID == id))
            .filter((cat): cat is CategoryInState => cat !== undefined)
            .map(function filterSubCategories(cat) {
                const catCopy = { ...cat };
                if (catCopy.subcategories) {
                    catCopy.subcategories = catCopy.subcategories.filter(c => ids.includes(c.UUID)).map(filterSubCategories);
                };
                return catCopy;
            });
    };

    const getBrandsByNames = (names: string[] | null = null) => {
        if (!names) return null;
        return names
            .map(name => brands.find(b => b.text == name))
            .filter((brand): brand is BrandInState => brand !== undefined)
    };

    const filter: filter = {
        minPrice: productsParamsFromServer?.minPrice || productsParamsFromFrontend.minPrice,
        maxPrice: productsParamsFromServer?.maxPrice || productsParamsFromFrontend.maxPrice,
        productsBrands: getBrandsByNames(productsParamsFromServer?.productsBrands || productsParamsFromFrontend.productsBrands),
        availableBrands: getBrandsByNames(productsParamsFromServer?.availableBrands || productsParamsFromFrontend.availableBrands),
        productsCategories: getCategoriesByIds(productsParamsFromServer?.productsCategories || productsParamsFromFrontend.productsCategories),
        inStock,
        brand,
        s
    };

    return filter;
};

const setSearchParams = ({ filters, brandName, searchParamsWOCategory, setSearch }: SetSearchParamsProps) => {
    const { category, s, ...filtersWOCategory } = filters;

    if (filtersWOCategory.brand == brandName) {
        delete filtersWOCategory.brand;
    };

    const { s: search, ...searchParams } = searchParamsWOCategory;

    if (searchParams.brand == brandName) {
        delete searchParams.brand;
    };

    if (compareObjects(filtersWOCategory, searchParams)) {
        return;
    };

    const newParams = Object.fromEntries(Object.entries(filtersWOCategory).map(e => {
        const [key, value] = e;
        return [key, "" + value]
    }));

    if (search) {
        newParams.s = search;
    };

    setSearch(newParams);
};

const Catalog_container = () => {
    const dispatch = useAppDispatch();
    const pathName = useLocation().pathname;

    const { categoryID, brandName, searchParams, setSearch } = useParamsFromUrl();
    const productsParamsFromServer = useProductsQueryParam(searchParams);

    const selectedProductsWithFiltersValue = useAppSelector((state) => selectProducts(state, searchParams));
    const filter = useFilter({ productsParamsFromServer, productsParamsFromFrontend: selectedProductsWithFiltersValue });

    const productsQty = useAppSelector((state) => state.products.qty);
    const categories = useSelector(selectCategories);
    const brands = useSelector(selectBrands);
    const filters = useSelector(selectFilters);

    const category = categories.find(c => c.UUID == categoryID);
    const brand = brands.find(b => translitBrand(b.text) == brandName);
    const filteredProductsQty = productsParamsFromServer ? productsParamsFromServer.qty : selectedProductsWithFiltersValue.qty;

    const { p, onpage, sorting, price } = searchParams;

    const setFilter = (value: Parameters<typeof filterActions['setFilters']>[number]) => {
        dispatch(filterActions.setFilters(value));
    };

    const clearFilter = (value: Parameters<typeof filterActions['clearSomeFilters']>[number]) => {
        dispatch(filterActions.clearSomeFilters(value));
    };

    const { category: c, ...searchParamsWOCategory } = searchParams;

    React.useEffect(() => {
        if (!productsParamsFromServer && (productsQty !== undefined || searchParams.s)) {
            dispatch(fetchSomeProducts());
        };
    }, [categoryID, brandName, searchParams]);

    React.useEffect(() => {
        // if (!compareObjects(filters, searchParams) && Object.keys(filters).length || (filters.s !== searchParams.s)) {
        //     dispatch(filterActions.clearFilters());
        // };
        dispatch(filterActions.setFilters(searchParams));
    }, [categoryID, brandName, searchParams.s]);

    React.useEffect(() => {
        setSearchParams({ filters, brandName, searchParamsWOCategory, setSearch });
    }, [filters, searchParamsWOCategory]);

    return (
        (brand || category || pathName == '/categories' || searchParams.s) &&
        <Catalog
            products={selectedProductsWithFiltersValue.selectedProducts || new Array(onpage ? +onpage : 20).fill(null)}
            category={category}
            brand={brand}
            qty={filteredProductsQty}
            filter={filter}
            page={p ? +p : 1}
            onpage={onpage ? +onpage : 20}
            sorting={sorting || 'popular'}
            setFilter={setFilter}
            clearFilter={clearFilter}
            price={price}
            searchParams={searchParams}
        />
        ||
        <NotFound />
    )
};

export default Catalog_container;