import express from 'express';
import createError from 'http-errors';
import { RequestCustom } from '../../../helpers';


import { collections } from '../../../db/services/db.service';


const router = express.Router();

router.post('/', async (req, res) => {
    const user = (req as RequestCustom).currentUser;
    if (!user) throw createError(500, `No user found`);
    const order = { ...req.body, status: "Новый", contacts: { ...req.body.contacts, _id: user ._id} };
    const orderID = await collections.orders.insertOne(order);
    if (user.orders) {
        await collections.users.updateOne({ _id: user._id }, { $push: { orders: orderID?.insertedId } });
    } else {
        await collections.users.updateOne({ _id: user._id }, { orders: [orderID?.insertedId] });
    };
    res.json(await collections.orders.findOne({ _id: orderID?.insertedId }));
});

export default router;