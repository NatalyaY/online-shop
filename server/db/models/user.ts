import { ObjectId } from "mongodb";

export default class User {
    constructor(
        public state: 'unauthorized' | 'authorized',
        public unauthorizedId?: ObjectId[],
        public phone?: string,
        public _id?: ObjectId,
        public name?: string,
        public email?: string,
        public address?: string,
        public password?: string,
        public orders?: ObjectId[],
        public favorites?: ObjectId,
        public cart?: ObjectId,
        public viewedProducts?: ObjectId[],
    ) { }
}