import React from 'react';
import express from 'express';
import path from 'path';
import * as fs from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';

import { RequestCustom } from '../../helpers';
import getQueryFromSearchParams from './../middleware/queryFromParams';
import fetchFromDB from './../middleware/fetchFromDB';
import theme from '../../../src/app/MUITheme';
import createEmotionCache from './../middleware/emotionCache';
import configureAppStore from '../../../src/app/store';


const router = express.Router();
const isProduction = process.env.NODE_ENV == 'production';

// if req is not for html and no static files were found before return 404
router.use((req, res, next) => {
    if (!req.headers.accept?.startsWith('text/html')) {
        return res.status(404).end();
    };
    next();
})

router.get('/*', getQueryFromSearchParams, fetchFromDB(), async (req, res) => {
    const {
        products,
        productsQty,
        favorites,
        cart,
        productsBrands,
        productsCategories,
        minPrice,
        maxPrice,
        availableBrands,
        availableCategories,
        orders,
        ...data } = (req as RequestCustom).fetchedData;
    const { _id, cart: c, unauthorizedId, orders: o, favorites: f, password, ...user } = (req as RequestCustom).currentUser;
    const queryParams = [
        {
            params: (req as RequestCustom).reqParams,
            products,
            qty: productsQty,
            productsBrands,
            productsCategories,
            minPrice,
            maxPrice,
            availableBrands,
            availableCategories
        }
    ];


    try {
        const state = {
            ...data,
            favorits: { ...{ items: favorites?.items }, status: 'iddle', lastUpdatedId: '' },
            cart: { ...{ items: cart?.items }, status: 'iddle', lastUpdatedId: '' },
            orders: { ...{ orders: orders }, status: 'iddle', lastUpdatedId: '' },
            user: { ...user, status: 'iddle' },
            products: {
                products,
                qty: productsQty,
                queryParams,
                status: 'iddle'
            }
        };

        const store = configureAppStore(state);

        const normalizedState = JSON.stringify(state).replace(
            /</g,
            '\\u003c'
        );

        const cache = createEmotionCache();
        const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

        const html = renderToString(
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Provider store={store} >
                        <StaticRouter location={req.url} />
                    </Provider>
                </ThemeProvider>
            </CacheProvider>,
        );

        const emotionChunks = extractCriticalToChunks(html);
        const emotionCss = constructStyleTagsFromChunks(emotionChunks);

        const indexPath = isProduction ? './dist/index.html' : './src/assets/index.html';

        let indexFile = await fs.readFile(indexPath, {
            encoding: 'utf8',
        });

        indexFile = indexFile
            .replace('<div id="app"></div>', `<div id="app">${html}</div>`)
            .replace('<title>', `<script>window.__PRELOADED_STATE__ = ${normalizedState}</script>\n<style>${emotionCss}</style>\n<title>`);

        if (!isProduction) {
            const { devMiddleware } = res.locals.webpack;
            const outputFileSystem = devMiddleware.outputFileSystem;
            const jsonWebpackStats = devMiddleware.stats.toJson();
            const { assetsByChunkName, outputPath } = jsonWebpackStats;
            const cssAsset: string = assetsByChunkName.index
                .filter((src: string) => src.endsWith(".css"))
                .map((src: string) => outputFileSystem.readFileSync(path.join(outputPath, src)))
                .join("\n");
            const jsAsset: string = assetsByChunkName.index
                .filter((src: string) => src.endsWith(".js") && !src.endsWith(".hot-update.js"))
                .map((src: string) => `<script src="/${src}" defer></script>`);
            indexFile = indexFile.replace('</title>', `</title>\n<style>${cssAsset}</style>\n${jsAsset}`);
        };
        res.send(indexFile);
    } catch (error) {
        console.log(error);
    };
});

export default router;
