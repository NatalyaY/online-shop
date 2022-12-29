import express from 'express';
import createError from 'http-errors';
import { RequestCustom } from '../../../helpers';

import { collections } from '../../../db/services/db.service';
import { UpdateResult, ObjectId } from 'mongodb';
import { addToCart, removeFromCart } from './requestTypes';


const router = express.Router();

router.post('/', async (req: addToCart, res, next) => {
    const { item: { id, qty } } = req.body;
    const toInsert = { id: new ObjectId(id), qty: qty || 1 };
    const user = (req as RequestCustom).currentUser;
    if (!user) return next(createError(500, `No user found`));
    let updatedCart: UpdateResult | null = null;

    try {
        if (user.cart) {
            const cart = await collections.carts.findOne({ _id: user.cart });
            const items = cart?.items.map(i => i.id.toString());
            const isUniq = !items?.includes(id);
            if (isUniq) {
                updatedCart = await collections.carts.updateOne({ _id: user.cart }, { $addToSet: { items: toInsert } });
            } else {
                const filteredItems = cart?.items.filter(i => i.id.toString() !== id) || [];
                const newItems = [...filteredItems, toInsert];
                updatedCart = await collections.carts.updateOne({ _id: user.cart }, { $set: { items: newItems } });
            };
        };

        await collections.products.updateOne({ _id: new ObjectId(id) }, { $inc: { popularity: 3 } });

        if (!user.cart || updatedCart && updatedCart.matchedCount == 0) {
            const cartId = await collections.carts.insertOne({
                userId: user._id!,
                items: [toInsert]
            });
            await collections.users.updateOne({ _id: user._id }, { $set: { cart: cartId.insertedId } });
        };
        res.status(200).json({ item: { id, qty } });
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
        next(createError(500, message));
    }
});

router.delete('/', async (req: removeFromCart, res, next) => {
    let { item } = req.body;

    const user = (req as RequestCustom).currentUser;
    if (!user) return next(createError(500, `No user found`));

    if (user.cart) {
        try {
            const userCart = await collections.carts.findOne({ _id: user.cart });
            if (userCart) {
                if (userCart.items.length == 1 && userCart.items[0].id.toString() == item) {
                    await collections.carts.deleteOne({ _id: user.cart });
                    await collections.users.updateOne({ _id: user._id }, { $unset: { cart: "" } });
                } else {
                    const newItems = userCart.items.filter(i => i.id.toString() !== item);
                    await collections.carts.updateOne({ _id: user.cart }, { $set: { items: newItems } });
                };
            };
            res.status(200).json({ item });
        } catch (error) {
            const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
            next(createError(500, message));
        }
    };
});


export default router;