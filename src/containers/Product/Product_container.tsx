import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/redux-hooks';
import NotFound from '../../components/NotFound/NotFound';
import Product from '../../components/Product/Product';
import { selectProductsByIDs } from '../../features/products/productsSlice';
import { ProductPageSkeleton } from './../../components/Product/Product';
import useProductsQueryParam from './../../common/hooks/useProductsQueryParam';
import { useSelector } from 'react-redux';
import { selectBrands } from '../../features/brands/brandsSlice';
import useSimilar from './../../common/hooks/useSimilar';
import useRecommended from './../../common/hooks/useRecommended';
import { ProductInState } from '../../../server/helpers';
import { useAppDispatch } from './../../app/redux-hooks';
import { setViews } from '../../features/user/userSlice';
import { selectUser } from './../../features/user/userSlice';
import useProductsByID from './../../common/hooks/useProductsByID';

const Product_container = () => {
    const PROD_REG = /prod-(?<product>([^\/]+?))-(.*)\/?/i;
    const dispatch = useAppDispatch();

    const user = useSelector(selectUser);

    const { product: ProdSlug, '*': rest } = useParams();
    const [slug, id] = ProdSlug?.split('-') || [];
    const productID = slug == 'prod' ? id : rest?.match(PROD_REG)?.groups?.product || null;
    const productFromState = useAppSelector((state) => selectProductsByIDs(state, [productID || '']))[0];
    const productsParamsFromServer = useProductsQueryParam({ _id: productID || '' });
    const brands = useSelector(selectBrands);

    const productFromServer = productsParamsFromServer?.products[0];
    const product = productFromServer || productFromState;

    const brand = brands.find(br => br.text == product?.brand);
    const brandLink = brand?.breadcrumps[brand?.breadcrumps.length - 1].link;
    const categoryLink = product?.breadcrumps[product?.breadcrumps.length - 2].link;
    const brandAndCategoryLink = (categoryLink && brandLink) ? categoryLink.replace('/categories', brandLink) : undefined;

    const categoryName = product?.breadcrumps[product.breadcrumps.length - 2].textRU;

    const viewedProducts = useProductsByID(user.viewedProducts || []).filter(p => p?._id !== productID);
    let similar = useSimilar(product);
    let recommended = useRecommended(product);

    if (recommended[0] !== null) {
        recommended = (recommended as ProductInState[]).filter(p =>
            similar.findIndex(s => s?._id == p._id) == -1
            &&
            viewedProducts.findIndex(s => s?._id == p._id) == -1
        );
    };

    React.useEffect(() => {
        dispatch(setViews());
    }, [productID]);

    if (!productID) return <NotFound />;
    if (!product) return <ProductPageSkeleton />;

    return (
        <Product key={productID} {...{ product, brandLink, categoryLink, brandAndCategoryLink, categoryName, similar, recommended, viewedProducts }} />
    )
};

export default Product_container;