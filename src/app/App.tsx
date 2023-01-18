import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import useAllProducts from '../common/hooks/useAllProducts';

import Header from '../containers/Header/Header_container';
import Footer from '../containers/Footer/Footer_container';
import ScrollTop from '../components/ScrollTop/ScrollTop';


const App = () => {
  useAllProducts();

  return (
    <>
      <Header />
      <main>
        <Outlet/>
        <ScrollRestoration />
        <ScrollTop/>
      </main>
      <Footer />
    </>
  )
}

export default App;
