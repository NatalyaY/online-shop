import express from 'express';
import webpack from 'webpack';
import wdm from 'webpack-dev-middleware';
import whm from 'webpack-hot-middleware';

export default function getHotReload(app: express.Application) {
    const isProduction = process.env.NODE_ENV == 'production';
    if (!isProduction) {
        const config = require('../../../webpack.config.js');
        const compiler = webpack(config());

        app.use(
            wdm(compiler, {
                publicPath: config().output.publicPath,
                serverSideRender: true
            }),
            whm(compiler, {
                log: false,
                path: `/__webpack_hmr`,
                heartbeat: 10 * 1000,
            })
        );
    };
}