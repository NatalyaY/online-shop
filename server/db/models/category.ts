import { ObjectId } from "mongodb";

export default class Category {
    constructor(
        public __text: string,
        public UUID: string,
        public _id?: ObjectId,
        public _parentId?: string,
        ) { }
}