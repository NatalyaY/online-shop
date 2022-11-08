import { ObjectId } from "mongodb";
import { breadcrump } from '../../helpers';

export default class Category {
    constructor(
        public __text: string,
        public UUID: string,
        public _id?: ObjectId,
        public _parentId?: string,
        public breadcrumps?: breadcrump[]
        ) { }
}