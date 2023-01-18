import express from 'express';
import createError from 'http-errors';
import { ObjectId } from 'mongodb';

import { RequestCustom } from '../../helpers';
import { collections } from '../../db/services/db.service';

const setProdViews = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const PROD_REG = /prod-(?<product>([^\/]+?))-(.*)\/?/i;
    const productId = req.url.match(PROD_REG)?.groups?.product || req.headers.referer?.match(PROD_REG)?.groups?.product;

    if (productId) {
        const user = (req as RequestCustom).currentUser;
        if (!user) return next(createError(500, `No user found`)) ;

        await collections.products.updateOne({ _id: new ObjectId(productId) }, { $inc: { popularity: 0.5 } });

        let products = [productId];

        if (user.viewedProducts) {
            products = [...new Set([productId, ...user.viewedProducts.map(id => id.toString())])].slice(0, 200);
        };

        const ids = products.map(id => new ObjectId(id));

        await collections.users.updateOne({ _id: user._id }, { $set: { viewedProducts: ids } });

        (req as RequestCustom).currentUser.viewedProducts = ids;
    };

    next();
};

export default setProdViews;