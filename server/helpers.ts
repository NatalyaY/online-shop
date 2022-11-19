import express from 'express';
import { ObjectId } from "mongodb";
import User from "./db/models/user";
import Category from "./db/models/category";
import Product from "./db/models/product";

export interface RequestCustom extends express.Request {
    token: { id: ObjectId };
    currentUser: User,
    queryBD: Record<string, string | number | { [key: string]: string | number | string[] } | ObjectId>,
    searchQueries: { [key: string]: any },
    fetchedData: any
}

export interface breadcrump {
    textRU: string,
    textEN: string,
    link: string,
    UUID?: string
}

export type ProductWithBreadcrumps = Product & { breadcrumps: breadcrump[] };

export type CategoryWithBreadcrumps = Category & { breadcrumps: breadcrump[] };

export type CategoryWithProductsQty = CategoryWithBreadcrumps & { productsQty: number };



export function setAuthCookie(res: express.Response, token: string) {
    res.cookie('token', token, {
        signed: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
}