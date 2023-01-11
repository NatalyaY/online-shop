import * as dotenv from "dotenv";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Collection, ObjectId, WithId } from "mongodb";
import express from 'express';
import { clearAuthCookie, RequestCustom, setAuthCookie } from '../../helpers';
import { collections } from '../../db/services/db.service';
import User from "../../db/models/user";
import unify from "../../../src/common/helpers/unify";
import { userLogin, userSignUp } from "../router/api/requestTypes";

dotenv.config();

function generateJWT(id: ObjectId) {

    const signature = process.env.JWT_SIGNATURE;
    const expiration = '30d';

    if (!signature) throw createError(500, 'JWT_SIGNATURE is undefined');

    return jwt.sign({ id }, signature, { expiresIn: expiration });
};

const mergeFavoritsAndCart = async ({ unauthorized, autorized }: { unauthorized: User, autorized: User }) => {
    const favorites = {
        un: await collections.favorites.findOne({ _id: unauthorized.favorites }),
        aut: await collections.favorites.findOne({ _id: autorized.favorites }),
        merged: undefined,
        type: 'favorites' as 'favorites'
    };
    const carts = {
        un: await collections.carts.findOne({ _id: unauthorized.cart }),
        aut: await collections.carts.findOne({ _id: autorized.cart }),
        merged: undefined,
        type: 'carts' as 'carts'
    };

    favorites.merged = unify(favorites.un?.items || [], favorites.aut?.items || []) as any;
    const filteredUnCart = carts.un?.items.filter(item => {
        const index = carts.aut?.items.findIndex(i => i.id.toString() == item.id.toString());
        if (index == -1) {
            return true
        }
    }) || []
    carts.merged = [...carts.aut?.items || []].concat(filteredUnCart) as any;

    if (favorites.un?.items) {
        if (favorites.aut?.items) {
            await collections.favorites.updateOne({ _id: autorized.favorites }, { $set: { items: favorites.merged } });
            await collections.favorites.deleteOne({ _id: unauthorized.favorites });
        } else {
            await collections.favorites.insertOne({
                userId: autorized._id!,
                items: favorites.un.items
            });
        }
    };

    if (carts.un?.items) {
        if (carts.aut?.items) {
            await collections.carts.updateOne({ _id: autorized.cart }, { $set: { items: carts.merged } });
            await collections.carts.deleteOne({ _id: unauthorized.cart });
        } else {
            await collections.carts.insertOne({
                userId: autorized._id!,
                items: carts.un.items
            });
        }
    };

}

const mergeItems = async (unauthorizedUser: User, autorizedUser: User) => {

    await mergeFavoritsAndCart({ unauthorized: unauthorizedUser, autorized: autorizedUser })

    if (unauthorizedUser.orders) {
        if (autorizedUser.orders) {
            await collections.users.updateOne({ _id: autorizedUser._id! }, { $push: { orders: { $each: unauthorizedUser.orders } } });
        } else {
            await collections.users.updateOne({ _id: autorizedUser._id! }, { $set: { orders: unauthorizedUser.orders } });
        };
    };

    if (unauthorizedUser.viewedProducts) {
        if (autorizedUser.viewedProducts) {
            await collections.users.updateOne({ _id: autorizedUser._id! }, { $push: { viewedProducts: { $each: unauthorizedUser.viewedProducts } } });
        } else {
            await collections.users.updateOne({ _id: autorizedUser._id! }, { $set: { viewedProducts: unauthorizedUser.viewedProducts } });
        };
    };
};

const createUnauthorizedUser = async () => {
    const userDoc: User = {
        state: 'unauthorized'
    };
    const userId = await collections.users.insertOne(userDoc);
    if (!userId) {
        throw createError(500, `Error while creating user in DB`);
    };
    return { token: generateJWT(userId.insertedId), userId: userId.insertedId };
};

export const isAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const signature = process.env.JWT_SIGNATURE;
    if (!signature) return next(createError(500, 'JWT_SIGNATURE is undefined'));
    if (!req.signedCookies.token) {
        let token: string;

        try {
            token = (await createUnauthorizedUser()).token;
        } catch (error) {
            return next(error);
        };
        setAuthCookie(res, token);
        try {
            (req as RequestCustom).token = jwt.verify(token, signature) as RequestCustom['token'];
        } catch (error) {
            return next(createError(401, 'Invalid token'));
        };
    } else {
        try {
            (req as RequestCustom).token = jwt.verify(req.signedCookies.token, signature) as RequestCustom['token'];
        } catch (error) {
            return next(createError(401, `${error}`));
        };
    };
    next();
};

export const attachUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const decodedToken = (req as RequestCustom).token;
    const currentUser = await collections.users.findOne({ _id: new ObjectId(decodedToken.id) });
    if (!currentUser) {
        clearAuthCookie(res);
        res.redirect('back');
    } else {
        (req as RequestCustom).currentUser = currentUser;
        return next();
    };
};



export const login = async (req: userLogin, res: express.Response, next: express.NextFunction) => {
    const { phone, password } = req.body;
    const unauthorizedUser = (req as RequestCustom).currentUser;

    if (!phone || !password) {
        return next(createError(400, 'Не введен логин или пароль'));
    };

    const autorizedUser = await collections.users.findOne({ phone });
    if (!autorizedUser) {
        return next(createError(400, `Пользователь ${phone} не найден`));
    };
    if (!autorizedUser.password) {
        return next(createError(500, `У пользователя ${phone} не найден пароль`));
    };
    const correctPassword = await argon2.verify(autorizedUser.password, password);
    if (!correctPassword) {
        return next(createError(400, `Неверный пароль`));
    };

    await mergeItems(unauthorizedUser, autorizedUser);

    await collections.users.updateOne({ _id: autorizedUser._id }, { $addToSet: { unauthorizedId: unauthorizedUser._id! } });

    const updateUnauthorizedDoc = {
        favorites: '' as '',
        cart: '' as '',
        viewedProducts: '' as '',
        orders: '' as '',
    };

    await collections.users.updateOne({ _id: new ObjectId(unauthorizedUser._id) }, { $unset: updateUnauthorizedDoc });

    const token = generateJWT(autorizedUser._id);
    setAuthCookie(res, token);

    (req as RequestCustom).currentUser = autorizedUser;
    return next();
};

export const signUp = async (req: userSignUp, res: express.Response, next: express.NextFunction) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return next(createError(400, 'Не введен логин или пароль'));
    };
    const unauthorizedUser = (req as RequestCustom).currentUser;

    const existingUser = await collections.users.findOne({ phone });
    if (existingUser) {
        return next(createError(500, `Такой пользователь уже существует`));
    };
    const passwordHashed = await argon2.hash(password);
    const autorizedUserDoc: User = {
        state: 'authorized',
        phone: phone,
        password: passwordHashed,
        unauthorizedId: [unauthorizedUser._id!],
        ...(unauthorizedUser.favorites ? { favorites: unauthorizedUser.favorites } : {}),
        ...(unauthorizedUser.cart ? { cart: unauthorizedUser.cart } : {}),
        ...(unauthorizedUser.viewedProducts ? { viewedProducts: unauthorizedUser.viewedProducts } : {}),
        ...(unauthorizedUser.orders ? { orders: unauthorizedUser.orders } : {}),
    };

    const updateUnauthorizedDoc = {
        favorites: '' as '',
        cart: '' as '',
        viewedProducts: '' as '',
        orders: '' as '',
    };

    await collections.users.updateOne({ _id: new ObjectId(unauthorizedUser._id) }, { $unset: updateUnauthorizedDoc });
    const autorizedUserId = await collections.users?.insertOne(autorizedUserDoc);
    const autorizedUser = await collections.users.findOne({ _id: new ObjectId(autorizedUserId.insertedId) });

    if (!autorizedUserId || !autorizedUser) {
        return next(createError(500, `Error while creating user in DB`));
    };
    const token = generateJWT(autorizedUserId.insertedId);
    setAuthCookie(res, token);

    (req as RequestCustom).currentUser = autorizedUser;
    return next();
};

export const logout = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = (req as RequestCustom);
    const currentUser = request.currentUser;
    const unauthorizedUserID = currentUser.unauthorizedId ? currentUser.unauthorizedId[currentUser.unauthorizedId.length - 1] : null;
    let token, userId;
    if (!unauthorizedUserID) {
        try {
            const newUser = await createUnauthorizedUser();
            userId = newUser.userId;
            token = newUser.token;
        } catch (error) {
            return next(error);
        };
    } else {
        token = generateJWT(unauthorizedUserID);
        userId = unauthorizedUserID;
    };

    setAuthCookie(res, token);
    const unauthorizedUser = await collections.users.findOne({ _id: new ObjectId(userId) });

    if (!unauthorizedUser) {
        return next(createError(401, 'No such unauthorized user'));
    } else {
        request.currentUser = unauthorizedUser;
        return next();
    };
};
