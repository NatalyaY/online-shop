import express from 'express';
import createError from 'http-errors';
import { ObjectId } from "mongodb";

import { RequestCustom, setAuthCookie } from '../../../helpers';
import { collections } from '../../../db/services/db.service';
import { login, logout, signUp } from '../../middleware/authservice';


const router = express.Router();

router.post('/login', async (req, res, next) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return next(createError(500, `Error while creating user in DB`));
    };
    try {
        const { user, token } = await login((req as RequestCustom).currentUser, phone, password);
        if (user) {
            const { _id, cart, unauthorizedId, orders, favorites, password, ...rest } = user;
            setAuthCookie(res, token);
            res
                .status(200)
                .json(rest);
        } else {
            res
                .status(200)
                .json({ error: { message: 'Internal error', status: 500 } });
        }
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
});

router.post('/signUp', async (req, res) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        throw createError(500, `Error while creating user in DB`);
    };
    try {
        const { user, token } = await signUp((req as RequestCustom).currentUser, phone, password);
        if (user) {
            const { _id, cart, unauthorizedId, orders, favorites, password, ...rest } = user;
            setAuthCookie(res, token);
            res
                .status(200)
                .json(rest);
        } else {
            res
                .status(200)
                .json({ error: { message: 'Internal error', status: 500 } });
        }
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
});

router.get('/logout', logout, (req, res) => {
    const currentUser = (req as RequestCustom).currentUser;
    const { _id, cart, unauthorizedId, orders, favorites, password, ...rest } = currentUser;
    res
        .status(200)
        .json(rest);
});

router.post('/', async (req, res) => {
    const currentUser = (req as RequestCustom).currentUser;
    await collections.users.updateOne({ _id: new ObjectId(currentUser._id) }, req.body);

    try {
        const updatedUser = await collections.users.findOne({ _id: new ObjectId(currentUser._id) });
        res
            .status(200)
            .json(updatedUser);
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
});

router.delete('/', async (req, res) => {
    const currentUser = (req as RequestCustom).currentUser;
    await collections.users.updateOne({ _id: new ObjectId(currentUser._id) }, { $unset: req.body });

    try {
        const updatedUser = await collections.users.findOne({ _id: new ObjectId(currentUser._id) });
        res
            .status(200)
            .json(updatedUser);
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : error;
        const status = createError.isHttpError(error) ? error.statusCode : 500;
        res
            .status(200)
            .json({ error: { message: message, status } });
    };
});

export default router;