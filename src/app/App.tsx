import React, { useEffect } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { fetchAllProducts } from '../features/products/productsSlice';
import { useAppDispatch, useAppSelector } from '../common/generics';
import getSocket from '../common/client_socket';


import ClassDefault from '../components/ClassDefault';
import Comp2 from '../components/Comp2';
import Header from '../components/Header';
import Error from '../components/Error';



function App() {

  const dispatch = useAppDispatch();
  const productsStatus = useAppSelector((state) => state.products.status);
  let isLoading = false;

  useEffect(() => {
    if (!isLoading && productsStatus != 'loading') {
      isLoading = true;
      dispatch(fetchAllProducts());
    };
    getSocket();
  }, [])

  return (
    <>
      <Header />
      <Routes>
        <Route path='*' element={<Error />} />
        <Route path="/" element={<ClassDefault />} />
        <Route path="/stat" element={<Comp2 />} />
        <Route path="/brands/*" element={<ClassDefault />} />
        <Route path="/search/?:search" element={<Error />} />
      </Routes>
    </>
  )
}

export default App;
