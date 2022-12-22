import express from 'express';
import createError from 'http-errors';
import { RequestCustom } from '../../../helpers';

import { collections } from '../../../db/services/db.service';
import { ObjectId } from 'mongodb';


const router = express.Router();

router.post('/', async (req, res) => {
    const user = (req as RequestCustom).currentUser;
    if (!user) throw createError(500, `No user found`);
    const order = { ...req.body, status: "Новый", contacts: { ...req.body.contacts, _id: user ._id} };
    const orderID = await collections.orders.insertOne(order);

    const items = (req.body.items as string[]).map(item => new ObjectId(item));

    await collections.products.updateMany({ _id: { $in: items } }, { $inc: { popularity: 5 } });

    if (user.orders) {
        await collections.users.updateOne({ _id: user._id }, { $push: { orders: orderID?.insertedId } });
    } else {
        await collections.users.updateOne({ _id: user._id }, { $set: { orders: [orderID?.insertedId] }});
    };
    res.json(await collections.orders.findOne({ _id: orderID?.insertedId }));
});

export default router;