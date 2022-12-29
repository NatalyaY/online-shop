import express from 'express';
import createError from 'http-errors';
import { RequestCustom } from '../../../helpers';

import { collections } from '../../../db/services/db.service';
import { UpdateResult, ObjectId } from 'mongodb';
import { addToFavorits, removeFromFavorits } from './requestTypes';


const router = express.Router();

router.post('/', async (req: addToFavorits, res, next) => {
    const { item } = req.body;
    const itemObjectId = new ObjectId(item);
    const user = (req as RequestCustom).currentUser;
    if (!user) return next(createError(500, `No user found`));
    let updatedFavorits: UpdateResult | null = null;

    try {
        if (user.favorites) {
            updatedFavorits = await collections.favorites.updateOne({ _id: user.favorites }, { $addToSet: { items: itemObjectId } });
        };

        await collections.products.updateOne({ _id: itemObjectId }, { $inc: { popularity: 1 } });

        if (!user.favorites || updatedFavorits && updatedFavorits.matchedCount == 0) {
            const favoritsId = await collections.favorites.insertOne({
                userId: user._id!,
                items: [itemObjectId]
            });
            await collections.users.updateOne({ _id: user._id }, { $set: { favorites: favoritsId.insertedId } });
        };
        res.status(200).json({ item });
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
        next(createError(500, message));
    }
});

router.delete('/', async (req: removeFromFavorits, res, next) => {
    let { item } = req.body;

    const user = (req as RequestCustom).currentUser;
    if (!user) return next(createError(500, `No user found`));
    try {
        if (user.favorites) {
            const userFavorits = await collections.favorites.findOne({ _id: user.favorites });
            if (userFavorits) {
                if (userFavorits.items.length == 1 && userFavorits.items[0].toString() == item) {
                    await collections.favorites.deleteOne({ _id: user.favorites });
                    await collections.users.updateOne({ _id: user._id }, { $unset: { favorites: "" } });
                } else {
                    await collections.favorites.updateOne({ _id: user.favorites }, { $pull: { items: new ObjectId(item) } });
                };
            };
        };
        res.status(200).json({ item });
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
        next(createError(500, message));
    }
});


export default router;