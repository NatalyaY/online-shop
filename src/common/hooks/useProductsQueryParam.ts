import { useAppSelector } from '../../app/redux-hooks';
import useParamsFromUrl from './useParamsFromUrl';
import compareObjects from './../helpers/compareObjects';
import { filtersState } from '../types';

export default function useProductsQueryParam(params: filtersState) {
    const queryParams = useAppSelector((state) => state.products.queryParams);
    const productsQueryParam = queryParams?.find(p => compareObjects(p.params, params));
    return productsQueryParam ? { ...productsQueryParam } : undefined;
};