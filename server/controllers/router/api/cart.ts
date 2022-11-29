import express from 'express';
import createError from 'http-errors';
import { RequestCustom } from '../../../helpers';


import { collections } from '../../../db/services/db.service';
import { UpdateResult } from 'mongodb';


const router = express.Router();

router.post('/', async (req, res) => {
    const { item } = req.body;
    const user = (req as RequestCustom).currentUser;
    if (!user) throw createError(500, `No user found`);
    let updatedCart: UpdateResult | null = null;

    if (user.cart) {
        updatedCart = await collections.carts.updateOne({ _id: user.cart }, { $addToSet: { items: item } });
    };

    if (!user.cart || updatedCart && updatedCart.matchedCount == 0) {
        const cartId = await collections.carts.insertOne({
            userId: user._id!,
            items: [item]
        });
        await collections.users.updateOne({ _id: user._id}, {$set: {cart: cartId.insertedId}});
    };
    res.status(200).json({ item });
});

router.delete('/', async (req, res) => {
    const { item } = req.body;
    const user = (req as RequestCustom).currentUser;
    if (!user) throw createError(500, `No user found`);
    if (user.cart) {
        const userCart = await collections.carts.findOne({ _id: user.cart });
        if (userCart!.items.length == 1 && userCart!.items[0] == item) {
            await collections.carts.deleteOne({ _id: user.cart });
            await collections.users.updateOne({ _id: user._id }, { $unset: { cart: "" } });
        } else {
            await collections.carts.updateOne({ _id: user.cart }, { $pull: { items: item } });
        };
    };
    res.status(200).json({ item });
});


export default router;