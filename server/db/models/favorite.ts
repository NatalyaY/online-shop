import { ObjectId } from "mongodb";

export default class Favorite {
    constructor(
        public items: ObjectId[],
        public _id?: ObjectId,
        public userId?: ObjectId,
    ) { }
}