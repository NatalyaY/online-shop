import { useAppSelector } from '../../app/redux-hooks';
import compareObjects from './../helpers/compareObjects';
import { filtersState, queryParams } from '../types';

type params = filtersState | { _id: string };

function useProductsQueryParam(params: params): queryParams | undefined;
function useProductsQueryParam(params: params[]): (queryParams | undefined)[];
function useProductsQueryParam(params: params | params[]) {
    const queryParams = useAppSelector((state) => state.products.queryParams);

    if (Array.isArray(params)) {
        return params.map(param => queryParams?.find(p => compareObjects(p.params, param)))
    } else {
        return queryParams?.find(p => compareObjects(p.params, params));
    };

};

export default useProductsQueryParam;