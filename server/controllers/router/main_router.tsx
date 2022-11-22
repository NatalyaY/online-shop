import express from 'express';
import path from 'path';
import * as fs from 'node:fs/promises';

import { RequestCustom } from '../../helpers';
import getQueryFromSearchParams from './../middleware/queryFromParams';
import fetchFromDB from './../middleware/fetchFromDB';


import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import { Provider } from 'react-redux';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import theme from '../../../src/app/MUITheme';
import createEmotionCache from './../middleware/emotionCache';

import configureAppStore from '../../../src/app/store';
import App from '../../../src/app/App';


const router = express.Router();
const isProduction = process.env.NODE_ENV == 'production';

router.use((req, res, next) => {
    if (!req.headers.accept?.startsWith('text/html')) {
        return;
    };
    next();
})

router.use(getQueryFromSearchParams, fetchFromDB());

router.get('/*', async (req, res) => {
    const data = (req as RequestCustom).fetchedData;
    try {
        data.products = {
            products: data.products,
            qty: data.productsQty,
            status: 'iddle'
        };
        delete data.productsQty;
        data.user = (req as RequestCustom).currentUser;

        const store = configureAppStore(data);

        const normalizedState = JSON.stringify(data).replace(
            /</g,
            '\\u003c'
        );

        const cache = createEmotionCache();
        const { extractCriticalToChunks, constructStyleTagsFromChunks } =
            createEmotionServer(cache);

        const html = renderToString(
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Provider store={store} >
                        <StaticRouter location={req.url} >
                            <App />
                        </StaticRouter>
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
