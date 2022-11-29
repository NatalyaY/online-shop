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
    let updatedFavorits: UpdateResult | null = null;

    if (user.favorites) {
        updatedFavorits = await collections.favorites.updateOne({ _id: user.favorites }, { $addToSet: { items: item } });
    };

    if (!user.favorites || updatedFavorits && updatedFavorits.matchedCount == 0) {
        const favoritsId = await collections.favorites.insertOne({
            userId: user._id!,
            items: [item]
        });
        await collections.users.updateOne({ _id: user._id }, { $set: { favorites: favoritsId.insertedId } });
    };
    res.status(200).json({ item });
});

router.delete('/', async (req, res) => {
    const { item } = req.body;
    const user = (req as RequestCustom).currentUser;
    if (!user) throw createError(500, `No user found`);
    if (user.favorites) {
        const userFavorits = await collections.favorites.findOne({ _id: user.favorites });
        if (userFavorits!.items.length == 1 && userFavorits!.items[0] == item) {
            await collections.favorites.deleteOne({ _id: user.favorites });
            await collections.users.updateOne({ _id: user._id }, { $unset: { favorits: "" } });
        } else {
            await collections.favorites.updateOne({ _id: user.favorites }, { $pull: { items: item } });
        };
    };
    res.status(200).json({ item });
});


export default router;