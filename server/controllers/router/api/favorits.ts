import express from 'express';
import createError from 'http-errors';
import { RequestCustom } from '../../../helpers';


import { collections } from '../../../db/services/db.service';


const router = express.Router();

router.post('/', async (req, res) => {
    const { _id } = req.body;
    const user = (req as RequestCustom).currentUser;
    if (!user) throw createError(500, `No user found`);
    if (user.favorites) {
        await collections.favorites.updateOne({ _id: user.favorites }, { $push: { items: _id } });
    } else {
        await collections.favorites.insertOne({
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
    if (user.favorites) {
        const userFavorits = await collections.favorites.findOne({ _id: user.favorites });
        if (userFavorits!.items.length == 1 && userFavorits!.items[0] == _id) {
            await collections.favorites.deleteOne({ _id: user.favorites });
            await collections.users.updateOne({ _id: user._id }, { $unset: { favorits: "" } });
        } else {
            await collections.favorites.updateOne({ _id: user.favorites }, { $pull: { items: _id } });
        };
    } else {
        throw createError(500, `No favorits`);
    };
    res.status(200).end();
});


export default router;