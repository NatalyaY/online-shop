import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import getSocket from '../common/helpers/client_socket';
import useAllProducts from '../common/hooks/useAllProducts';

import Home from '../components/Home/Home';
import Header from '../containers/Header/Header_container';
import Footer from '../containers/Footer/Footer_container';
import Error from '../components/Error/Error';




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
          <Route path='*' element={<Error />} />
          <Route path="/" index={true} element={<Home />} />
          <Route path="/search/?:search" element={<Error />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App;
