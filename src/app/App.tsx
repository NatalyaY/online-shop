import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { fetchAllProducts } from '../features/products/productsSlice';
import { useAppDispatch, useAppSelector } from '../common/generics';
import getSocket from '../common/client_socket';
import useAllProducts from '../common/hooks/useAllProducts';


import ClassDefault from '../components/ClassDefault';
import Home from '../components/Home';
import Header from '../containers/Header_container';
import Footer from '../containers/Footer_container';
import Error from '../components/Error';




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
          <Route path="/" element={<Home />} />
          <Route path="/brands/*" element={<ClassDefault />} />
          <Route path="/search/?:search" element={<Error />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App;
