import { ObjectId } from "mongodb";

export default class Cart {
    constructor(
        public items: ObjectId[],
        public _id?: ObjectId,
        public userId?: ObjectId,
    ) { }
}