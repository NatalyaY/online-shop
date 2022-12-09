import { useSearchParams, useParams } from 'react-router-dom';
import { filtersState } from '../types';
import { filtersStateKeys } from './../../features/filters/filtersSlice';

export default function useParamsFromUrl() {
    const CAT_REG = /cat-(?<category>([^\/]+?))-(.*)\/?/i;

    const { brand: brandName, category: categorySlug, '*': slag } = useParams() as { brand: string | undefined, category: string | undefined, '*': string | undefined };
    const [slug, id] = categorySlug?.split('-') || [];
    const categoryID = slug == 'cat' ? id : slag?.match(CAT_REG)?.groups?.category || undefined;

    const [search, setSearch] = useSearchParams();

    const searchParams: filtersState = Object.fromEntries([...search.entries()].filter(e => (filtersStateKeys as any).includes(e[0])).map(e => [e[0], decodeURIComponent(e[1])]));

    if (searchParams.price) {
        const [min, max] = searchParams.price;
        if (isNaN(+min) || isNaN(+max) || !min || !max) delete searchParams.price;
    };

    if (searchParams.sorting && !["new", "price_desc", "price_asc", "popular"].includes(searchParams.sorting)) {
        delete searchParams.sorting;
    };

    const params = { ...searchParams, ...(categoryID && { category: categoryID }), ...(brandName && { brand: brandName }) };
    return { searchParams: params, categoryID, brandName, setSearch };
};