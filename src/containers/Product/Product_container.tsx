import React from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../../components/NotFound/NotFound';

const Product_container = () => {
    const PROD_REG = /prod-(?<product>([^\/]+?))-(.*)\/?/i;

    const { product: ProdSlug, '*': rest } = useParams();
    const [slug, id] = ProdSlug?.split('-') || [];
    const product = slug == 'prod' ? id : rest?.match(PROD_REG)?.groups?.product || null

    return (
        product &&
        <>
            <h1>Product</h1>
            <p>{product + ' Product'}</p>
        </>
        ||
        <NotFound />
    )
};

export default Product_container;