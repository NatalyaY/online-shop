import { ObjectId } from "mongodb";

export default class Cart {
    constructor(
        public items: { id: ObjectId, qty: number }[],
        public userId: ObjectId,
        public _id?: ObjectId,
    ) { }
}