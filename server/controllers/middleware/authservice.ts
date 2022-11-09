import * as dotenv from "dotenv";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { ObjectId } from "mongodb";
import express from 'express';
import { RequestCustom, setAuthCookie } from '../../helpers';
import { collections } from '../../db/services/db.service';
import User from "../../db/models/user";

dotenv.config();

function generateJWT(id: ObjectId) {

    const signature = process.env.JWT_SIGNATURE;
    const expiration = '30d';

    if (!signature) throw createError(500, 'JWT_SIGNATURE is undefined');

    return jwt.sign({ id }, signature, { expiresIn: expiration });
};

const mergeCartAndFavorits = async (unauthorizedUser: User, autorizedUser: User) => {
    if (unauthorizedUser.favorites) {
        const unauthorizedUserFavorits = await collections.favorites.findOne({ _id: new ObjectId(unauthorizedUser.favorites) });
        if (unauthorizedUserFavorits?.items) {
            const autorizedUserFavorits = await collections.favorites.findOne({ _id: new ObjectId(autorizedUser.favorites) });
            const concatedFavorits = unauthorizedUserFavorits.items;
            if (autorizedUserFavorits?.items) {
                concatedFavorits.push(...autorizedUserFavorits.items)
            };
            await collections.favorites.updateOne({ _id: new ObjectId(autorizedUser.favorites) }, { $set: { items: concatedFavorits }});
        };
        await collections.favorites.deleteOne({ _id: new ObjectId(unauthorizedUser.favorites) });
    };
    if (unauthorizedUser.cart) {
        const unauthorizedUserCart = await collections.carts.findOne({ _id: new ObjectId(unauthorizedUser.cart) });
        if (unauthorizedUserCart?.items) {
            const autorizedUserCart = await collections.carts.findOne({ _id: new ObjectId(autorizedUser.cart) });
            const concatedCart = unauthorizedUserCart.items;
            if (autorizedUserCart?.items) {
                concatedCart.push(...autorizedUserCart.items)
            };
            await collections.carts.updateOne({ _id: new ObjectId(autorizedUser.cart) }, { $set: {items: concatedCart} });
        };
        await collections.carts.deleteOne({ _id: new ObjectId(unauthorizedUser.cart) });
    }
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
        const { token } = await createUnauthorizedUser();
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
        return next(createError(401, 'No such user'));
    } else {
        (req as RequestCustom).currentUser = currentUser;
        return next();
    };
};


/**
 * It takes an unauthorized user, a phone number and a password, finds the authorized user with the
 * given phone number, checks if the password is correct, merges the unauthorized user's cart and
 * favorites with the authorized user's, and returns the authorized user and a token
 * @param {User} unauthorizedUser - User - the user who is not authorized
 * @param phone - NonNullable<User['phone']>
 * @param password - NonNullable<User['password']>
 * @returns { user: User | null, token: string }
 */
export const login = async (unauthorizedUser: User, phone: NonNullable<User['phone']>, password: NonNullable<User['password']>) => {
    const autorizedUser = await collections.users.findOne({ phone });
    if (!autorizedUser) {
        throw createError(400, `Пользователь '${phone}' не найден`);
    };
    if (!autorizedUser.password) {
        throw createError(500, `У пользователя '${phone}' не найден пароль`);
    };
    const correctPassword = await argon2.verify(autorizedUser.password, password);
    if (!correctPassword) {
        throw createError(400, `Неверный пароль`);
    };

    await mergeCartAndFavorits(unauthorizedUser, autorizedUser);

    if (!autorizedUser.unauthorizedId || !autorizedUser.unauthorizedId.includes(unauthorizedUser._id!)) {
        autorizedUser.unauthorizedId ? autorizedUser.unauthorizedId.push(unauthorizedUser._id!) : [unauthorizedUser._id!];
    };
    const updateUnauthorizedDoc: Partial<User> = {
        favorites: undefined,
        cart: undefined
    };
    await collections.users.updateOne({ _id: new ObjectId(unauthorizedUser._id) }, { $set: updateUnauthorizedDoc });
    // fetch user again because cart and favorites could be merged with unauthorized and so changed since first fetch
    return { user: await collections.users.findOne({ _id: new ObjectId(autorizedUser._id) }), token: generateJWT(autorizedUser._id) };
};

export const signUp = async (unauthorizedUser: User, phone: NonNullable<User['phone']>, password: NonNullable<User['password']>) => {
    const existingUser = await collections.users.findOne({ phone });
    if (existingUser) {
        throw createError(500, `Такой пользователь уже существует`);
    };
    const passwordHashed = await argon2.hash(password);
    const autorizedUserDoc: User = {
        state: 'authorized',
        phone: phone,
        password: passwordHashed,
        favorites: unauthorizedUser.favorites,
        cart: unauthorizedUser.cart,
        unauthorizedId: [unauthorizedUser._id!]
    };
    const updateUnauthorizedDoc: Partial<User> = {
        favorites: undefined,
        cart: undefined
    };
    await collections.users.updateOne({ _id: new ObjectId(unauthorizedUser._id) }, {$set: updateUnauthorizedDoc});
    const autorizedUserId = await collections.users?.insertOne(autorizedUserDoc);
    if (!autorizedUserId) {
        throw createError(500, `Error while creating user in DB`);
    };
    return { user: await collections.users.findOne({ _id: new ObjectId(autorizedUserId.insertedId) }), token: generateJWT(autorizedUserId.insertedId) };
};

export const logout = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = (req as RequestCustom);
    const currentUser = request.currentUser;
    const unauthorizedUserID = currentUser.unauthorizedId ? currentUser.unauthorizedId[currentUser.unauthorizedId.length - 1] : null;
    let token, userId;
    if (!unauthorizedUserID) {
        const newUser = await createUnauthorizedUser();
        userId = newUser.userId;
        token = newUser.token;
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
