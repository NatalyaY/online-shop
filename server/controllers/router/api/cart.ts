import express from 'express';
import createError from 'http-errors';
import { RequestCustom } from '../../../helpers';


import { collections } from '../../../db/services/db.service';


const router = express.Router();

router.post('/', async (req, res) => {
    const { _id } = req.body;
    const user = (req as RequestCustom).currentUser;
    if (!user) throw createError(500, `No user found`);
    if (user.cart) {
        await collections.carts.updateOne({ _id: user.cart }, { $push: { items: _id } });
    } else {
        await collections.carts.insertOne({
            userId: user._id!,
            items: [_id]
        });
    };
    res.status(200).end();
});

router.delete('/', async (req, res) => {
    const { _id } = req.body;
    const user = (req as RequestCustom).currentUser;
    if (!user) throw createError(500, `No user found`);
    if (user.cart) {
        const userCart = await collections.carts.findOne({ _id: user.cart });
        if (userCart!.items.length == 1 && userCart!.items[0] == _id) {
            await collections.carts.deleteOne({ _id: user.cart });
            await collections.users.updateOne({ _id: user._id }, { $unset: { cart: "" } });
        } else {
            await collections.carts.updateOne({ _id: user.cart }, { $pull: { items: _id } });
        };
    } else {
        throw createError(500, `No cart`);
    };
    res.status(200).end();
});


export default router;