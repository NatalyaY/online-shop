import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import Home from '../components/Home/Home';
import Catalog_container from '../containers/Catalog/Catalog_container';
import Product_container from '../containers/Product/Product_container';
import NotFound from '../components/NotFound/NotFound';

export default createBrowserRouter(
    createRoutesFromElements(
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
                    '/categories'
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
            <Route path="/search" element={< Catalog_container />} />
            <Route path='*' element={< NotFound />} />
        </Route>
    )
);