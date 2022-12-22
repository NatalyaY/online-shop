import express from 'express';
import { RequestCustom } from '../../helpers';
import { collections } from '../../db/services/db.service';
import createError from 'http-errors';
import { ObjectId } from 'mongodb';

const setProdViews = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const PROD_REG = /prod-(?<product>([^\/]+?))-(.*)\/?/i;
    const id = req.url.match(PROD_REG)?.groups?.product || req.headers.referer?.match(PROD_REG)?.groups?.product;

    if (id) {
        const user = (req as RequestCustom).currentUser;
        if (!user) throw createError(500, `No user found`);

        await collections.products.updateOne({ _id: new ObjectId(id) }, { $inc: { popularity: 0.5 } });

        let products = [id];

        if (user.viewedProducts) {
            products = [...new Set([id, ...user.viewedProducts.map(id => id.toString())])].slice(0, 200);
        };

        const ids = products.map(id => new ObjectId(id));

        await collections.users.updateOne({ _id: user._id }, { $set: { viewedProducts: ids } });

        (req as RequestCustom).currentUser.viewedProducts = ids;
    };

    next();
};

export default setProdViews;