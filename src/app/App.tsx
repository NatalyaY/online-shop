import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import getSocket from '../common/helpers/client_socket';
import useAllProducts from '../common/hooks/useAllProducts';

import Home from '../components/Home/Home';
import Header from '../containers/Header/Header_container';
import Footer from '../containers/Footer/Footer_container';
import NotFound from '../components/NotFound/NotFound';
import Catalog_container from './../containers/Catalog/Catalog_container';
import Product_container from '../containers/Product/Product_container';

Catalog_container

const App = () => {
  useAllProducts();

  useEffect(() => {
    getSocket();
  }, [])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {
            [
              '/brands/:brand',
              '/brands/:brand/:c1/:c2/:c3/*',
              '/brands/:brand/:c1/:c2/:category',
              '/brands/:brand/:c1/:category',
              '/brands/:brand/:category',
              '/categories/:c1/:c2/:category',
              '/categories/:c1/:category',
              '/categories/:category',
              '/categories/:c1/:c2/:c3/*'
            ].map((path, i) => <Route path={path} key={i} element={<Catalog_container />} />)
          }
          {
            [
              '/:c1/:c2/:c3/:product',
              '/:c1/:c2/:product',
              '/:c1/:product',
              '/:c1/:c2/:c3/*'
            ].map((path, i) => <Route path={path} key={i} element={<Product_container />} />)
          }
          <Route path="/:c1/:c2/:product" element={<Catalog_container />} />
          <Route path="/search/?:search" element={<NotFound />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App;
