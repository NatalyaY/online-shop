import express from 'express';
import createError from 'http-errors';

import { collections } from '../../../db/services/db.service';
import { newSubscriber } from './requestTypes';

const router = express.Router();

router.post('/', async (req: newSubscriber, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(createError(500, "Не указан email"));
    };
    const existingSudscriber = await collections.subscribers.findOne({ email });
    if (existingSudscriber) {
        return next(createError(500, "Вы уже подписаны"));
    };
    const sudscriberID = await collections.subscribers.insertOne({email});
    if (!sudscriberID.insertedId) {
        return next(createError(500, "Внутренняя ошибка"));
    };
    res.status(200).end();
});

export default router;