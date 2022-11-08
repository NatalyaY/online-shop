import { ObjectId } from "mongodb";

export default class Cart {
    constructor(
        public items: [ObjectId, ...ObjectId[]],
        public userId: ObjectId,
        public _id?: ObjectId,
    ) { }
}