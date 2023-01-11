import express from 'express';
import createError from 'http-errors';
import { ObjectId } from "mongodb";
import argon2 from 'argon2';

import { RequestCustom, UserMapped } from '../../../helpers';
import { collections } from '../../../db/services/db.service';
import { login, logout, signUp } from '../../middleware/authservice';
import setProdViews from './../../middleware/setProdViews';
import { userAddOrRemoveFields, userChangePassword, userLogin } from './requestTypes';
import fetchFromDB from './../../middleware/fetchFromDB';


const router = express.Router();

router.post('/login', login, fetchFromDB({ coll: ['cart', 'favorites', 'orders'] }), (req: userLogin, res) => {
    const currentUser = (req as RequestCustom).currentUser;
    const { _id, cart: c, unauthorizedId, orders: o, favorites: f, password, ...rest } = currentUser;
    const { cart, favorites, orders } = (req as RequestCustom).fetchedData;
    res
        .status(200)
        .json({
            cart: { ...{ items: cart?.items }, status: 'iddle', lastUpdatedId: '' },
            favorits: { ...{ items: favorites?.items }, status: 'iddle', lastUpdatedId: '' },
            orders: { ...{ orders: orders }, status: 'iddle', lastUpdatedId: '' },
            user: rest as UserMapped
        });

});

router.post('/signUp', signUp, (req, res) => {
    const currentUser = (req as RequestCustom).currentUser;
    const { _id, cart, unauthorizedId, orders, favorites, password, ...rest } = currentUser;
    res
        .status(200)
        .json(rest);
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
        console.log(error);
        const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
        next(createError(500, message));
    };
});

router.post('/changePassword', async (req: userChangePassword, res, next) => {
    const currentUser = (req as RequestCustom).currentUser;
    const { currentPassword, newPassword } = req.body;

    try {
        if (!currentUser.password) {
            return next(createError(500, `У пользователя ${currentUser.phone} не найден пароль`));
        };
        const isPasswordCorrect = await argon2.verify(currentUser.password, currentPassword);
        if (!isPasswordCorrect) {
            return next(createError(400, 'Неверный пароль'));
        };
        const isPasswordTheSame = await argon2.verify(currentUser.password, newPassword);
        if (isPasswordTheSame) {
            return next(createError(400, 'Новый пароль не должен совпадать со старым'));
        };
        const hashed = await argon2.hash(newPassword);
        await collections.users.updateOne({ _id: currentUser._id }, { $set: { password: hashed } });
        res
            .status(200)
            .json({})
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