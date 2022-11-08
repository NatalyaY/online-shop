import { ObjectId } from "mongodb";

export default class Favorite {
    constructor(
        public items: ObjectId[],
        public userId: ObjectId,
        public _id?: ObjectId,
    ) { }
}