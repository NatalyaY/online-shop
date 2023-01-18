import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import Home from '../components/Home/Home';
import Catalog_container from '../containers/Catalog/Catalog_container';
import Product_container from '../containers/Product/Product_container';
import NotFound from '../components/NotFound/NotFound';
import Favorites_container from '../containers/Favorites/Favorites_container';
import Cart_container from '../containers/Cart/Cart_container';
import User_container from '../containers/User/User_container';
import DeliveryAndPayment from './../static/DeliveryAndPayment';
import Contacts from './../static/Contacts';
import Brand from './../static/Brand';

export default createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
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
                        '/categories/:c1/:c2/:c3/*',
                        '/categories',
                        '/search'
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
                <Route path="/favorits" element={< Favorites_container />} />
                <Route path="/cart" element={< Cart_container />} />
                {
                    [
                        '/my',
                        '/my/details',
                        '/my/orders',
                    ].map((path, i) => <Route path={path} key={i} element={<User_container />} />)
                }
                <Route path='/delivery' element={<DeliveryAndPayment />} />
                <Route path='/contacts' element={<Contacts />} />

                <Route path='*' element={<NotFound />} />
            </Route>
            <Route path='/about' element={<Brand />} />
        </>
    )
);