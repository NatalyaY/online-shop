import express from 'express';
import createError from 'http-errors';
import { OrderMapped, RequestCustom } from '../../../helpers';

import { collections } from '../../../db/services/db.service';
import { ObjectId } from 'mongodb';
import { newOrder } from './requestTypes';


const router = express.Router();

router.post('/', async (req: newOrder, res, next) => {

    const user = (req as RequestCustom).currentUser;
    if (!user) return next(createError(500, `No user found`));
    const { items, contacts, ...rest } = req.body;
    const UUID = "" + Math.floor(Math.random() * 1000000);

    const order = {
        ...rest,
        status: "Новый" as "Новый",
        contacts: { ...contacts, _id: user._id },
        UUID,
        items: items.map(i => { return { ...i, id: new ObjectId(i.id) } }),
        creationDate: Date.now(),
    };

    try {
        const orderID = await collections.orders.insertOne(order);
        const insertedOrder = await collections.orders.findOne<OrderMapped>({ _id: orderID.insertedId });

        if (!insertedOrder) return next(createError(500, `No order created`));
        const itemsObjectId = (req.body.items as any[]).map(item => new ObjectId(item.id));
        const items = (req.body.items as any[]).map(item => item.id);
        await collections.products.updateMany({ _id: { $in: itemsObjectId } }, { $inc: { popularity: 5 } });

        await collections.users.updateOne({ _id: user._id },
            user.orders ?
                { $push: { orders: orderID?.insertedId } }
                : { $set: { orders: [orderID?.insertedId] } });

        if (user.cart) {
            const userCart = await collections.carts.findOne({ _id: user.cart });
            const newItems = userCart?.items.filter(item => !items.includes(item.id.toString()));
            if (newItems && newItems.length == 0) {
                await collections.carts.deleteOne({ _id: user.cart });
                await collections.users.updateOne({ _id: user._id }, { $unset: { cart: "" } });
            } else {
                newItems ?
                    await collections.carts.updateOne({ _id: user.cart }, { $set: { items: newItems } })
                    :
                    await collections.users.updateOne({ _id: user._id }, { $unset: { cart: "" } });
            };
        };

        res.json(insertedOrder);

    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
        next(createError(500, message));
    }
});

export default router;