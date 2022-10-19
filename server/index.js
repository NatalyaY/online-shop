const express = require('express');
const connectToDatabase = require("./db/services/db.service.js").connectToDatabase;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const isProduction = process.env.NODE_ENV == 'production';
const staticDir = isProduction ? '.' : './../dist'

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('sdhshd6esj'));
app.use(express.static(staticDir));

if (isProduction) {

    app.get('*', (req, res) => {
        res.sendFile(__dirname + '/index.html')
    });

} else {
    const webpack = require('webpack');
    const config = require('../webpack.config.js');
    const historyApiFallback = require("connect-history-api-fallback");
    const compiler = webpack(config());
    app.use(
        require('webpack-dev-middleware')(compiler, {
            publicPath: config().output.publicPath,
        })
    );
    app.use(historyApiFallback());
    app.use(
        require('webpack-dev-middleware')(compiler, {
            publicPath: config().output.publicPath,
        })
    );
    app.use(
        require(`@gatsbyjs/webpack-hot-middleware`)(compiler, {
            log: false,
            path: `/__webpack_hmr`,
            heartbeat: 10 * 1000,
        })
    );
};


app.use(function (req, res, next) {
    const err = { status: 404, message: 'wtf' };
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (err.status === 401) {
        console.log('Error: ', err.message);
        return res.cookie('page', req.url, {
            signed: true,
            maxAge: 3600 * 24,
            httpOnly: true,
        }).redirect('/login');
    };
    console.log('Error status: ', err.status + ', msg: ', err.message);
    res.json({
        message: err.message,
        error: err.status,
        test: 'dfdf666'
    })
});

app.set('port', 8080);
connectToDatabase().then(() => {
    console.log('connect to database');
    app.listen(app.get('port'));
}
);