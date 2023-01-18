import express from 'express';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './db/services/db.service';
import { isAuth, attachUser } from './controllers/middleware/authservice';
import gethotReload from './controllers/middleware/hotReload';

import apiRoter from './controllers/router/api_router';
import mainRoter from './controllers/router/main_router';
import imageRouter from './controllers/router/image_router';


const app = express();
const staticDir = '../dist';

gethotReload(app);

app.use('/img/products', imageRouter);

app.use(
    cookieParser('sdhshd6esj'),
    express.static(staticDir, { index: false }),
    isAuth,
    attachUser,
);

app.use('/api', apiRoter);
app.use('/', mainRoter);

app.set('port', 3000);


connectToDatabase().then(async () => {
    app.listen(app.get('port'));
});
