import { ObjectId } from "mongodb";

export default class Subscriber {
    constructor(
        public email: string,
        public _id?: ObjectId,
    ) { }
}