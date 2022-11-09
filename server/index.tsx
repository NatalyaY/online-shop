import express from 'express';
import cookieParser from 'cookie-parser';
import expressWs from 'express-ws';

import { RequestCustom } from './helpers';
import { connectToDatabase, collections } from './db/services/db.service';
import { isAuth, attachUser } from './controllers/middleware/authservice';
import gethotReload from './controllers/middleware/hotReload';

import apiRoter from './controllers/router/api_router';
import mainRoter from './controllers/router/main_router';

const appBase = express();
const wsInstance = expressWs(appBase);
const { app } = wsInstance;
const staticDir = './dist';

gethotReload(app);

app.use(
    cookieParser('sdhshd6esj'),
    express.static(staticDir, { index: false }),
    isAuth,
    attachUser,
);

app.use('/api', apiRoter);
app.use('/', mainRoter);


app.ws('/watch', (ws, req) => {
    const user = (req as RequestCustom).currentUser;
    const categoriesWatchCursor = collections.categories.watch([], { fullDocument: "updateLookup" });
    const productsWatchCursor = collections.products.watch([], { fullDocument: "updateLookup" });
    const pipeline = [
        { $match: { 'fullDocument._id': user._id } }
    ];
    const ordersWatchCursor = collections.orders.watch(pipeline, { fullDocument: "updateLookup" });

    [categoriesWatchCursor, productsWatchCursor, ordersWatchCursor].forEach(cursor => {
        cursor.on('change', (change) => {
            ws.send(JSON.stringify(change));
        });
    });
});


app.set('port', 3000);


connectToDatabase().then(async () => {
    app.listen(app.get('port'));
});