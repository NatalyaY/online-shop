import { ObjectId } from "mongodb";

export default class User {
    constructor(
        public state: 'unauthorized' | 'authorized',
        public unauthorizedId?: ObjectId[],
        public phone?: string,
        public _id?: ObjectId,
        public name?: string,
        public surname?: string,
        public email?: string,
        public city?: string,
        public street?: string,
        public house?: string,
        public flat?: string,
        public password?: string,
        public orders?: ObjectId[],
        public favorites?: ObjectId,
        public cart?: ObjectId,
    ) { }
}