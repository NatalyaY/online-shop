import express from 'express';
import createError from 'http-errors';
import { ObjectId } from "mongodb";

import { RequestCustom, setAuthCookie, UserMapped } from '../../../helpers';
import { collections } from '../../../db/services/db.service';
import { login, logout, signUp } from '../../middleware/authservice';
import setProdViews from './../../middleware/setProdViews';
import { userAddOrRemoveFields, userLoginOrSignUp } from './requestTypes';


const router = express.Router();

router.post('/login', async (req: userLoginOrSignUp, res, next) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return next(createError(400, 'Не введен логин или пароль'));
    };
    try {
        const { user, token } = await login((req as RequestCustom).currentUser, phone, password);
        if (user) {
            const { _id, cart, unauthorizedId, orders, favorites, password, ...rest } = user;
            setAuthCookie(res, token);
            res
                .status(200)
                .json(rest as UserMapped);
        } else {
            return next(createError(500, 'No user created'))
        }
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
        next(createError(500, message));
    };
});

router.post('/signUp', async (req: userLoginOrSignUp, res, next) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return next(createError(400, 'Не введен логин или пароль'));
    };
    try {
        const { user, token } = await signUp((req as RequestCustom).currentUser, phone, password);
        if (user) {
            const { _id, cart, unauthorizedId, orders, favorites, password, ...rest } = user;
            setAuthCookie(res, token);
            res
                .status(200)
                .json(rest as UserMapped);
        } else {
            return next(createError(500, 'No user created'))
        }
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
        next(createError(500, message));
    };
});

router.get('/logout', logout, (req, res) => {
    const currentUser = (req as RequestCustom).currentUser;
    const { _id, cart, unauthorizedId, orders, favorites, password, ...rest } = currentUser;
    res
        .status(200)
        .json(rest);
});

router.post('/', async (req: userAddOrRemoveFields, res, next) => {
    const currentUser = (req as RequestCustom).currentUser;
    const { item } = req.body;

    try {
        await collections.users.updateOne({ _id: new ObjectId(currentUser._id) }, { $set: item });
        res
            .status(200)
            .json(item);
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
        next(createError(500, message));
    };
});

router.delete('/', async (req: userAddOrRemoveFields, res, next) => {
    const currentUser = (req as RequestCustom).currentUser;
    const { item } = req.body;

    const fieldsToUnset = Object.fromEntries(Object.entries(item).map(entry => {
        return [entry[0], '' as '']
    }))


    try {
        await collections.users.updateOne({ _id: new ObjectId(currentUser._id) }, { $unset: fieldsToUnset });
        res
            .status(200)
            .json(item);
    } catch (error) {
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
        next(createError(500, message));
    };
});

router.get('/setViews', setProdViews, (req, res) => {
    const user = (req as RequestCustom).currentUser;
    res
        .status(200)
        .json(user.viewedProducts);
});

export default router;