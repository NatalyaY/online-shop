import React, { useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { selectProducts, selectProductByID, fetchOneProduct, fetchSomeProducts } from '../features/products/productsSlice';
import { useSelector } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../common/generics';
import Product from "../../server/db/models/product";

import Typography from '@mui/material/Typography';



const ClassDefault: React.FC<{}> = () => {
  const products = useSelector(selectProducts);
  const dispatch = useAppDispatch();

  let [searchParams, setSearchParams] = useSearchParams();
  const productsStatus = useAppSelector((state) => state.products.status);
  const testproduct = useAppSelector((state) => selectProductByID(state, "635a8f4f8cb47f8d76d4f9cd"));
  let isLoading = false;

  useEffect(() => {
    if (!testproduct && productsStatus != 'succeeded' && !isLoading) {
      isLoading = true;
      dispatch(fetchOneProduct('635a8f4f8cb47f8d76d4f9cd'));
      dispatch(fetchSomeProducts());
    }
  }, [])

  return (
    <div>
      <Typography component="h2" variant='h2'>Products:</Typography>;
      <ProductFC product={testproduct}/>
    </div>
  )
}

export const ProductFC: React.FC<{ product: Product | null }> = ({product}) => {
  return (
    product &&
    <div key={product._id as unknown as string}>{product.name}</div>
    || <p>Loading...</p>
  )
}

export default ClassDefault