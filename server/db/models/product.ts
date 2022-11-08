import { ObjectId } from "mongodb";
import { type breadcrump } from '../../helpers';

export default class Product {
    constructor(
        public name: string,
        public price: number,
        public image: string[],
        public sku: string,
        public amount: number,
        public brand: string,
        public categoryId: string,
        public creationDate: number,
        public popularity: number,
        public _id?: ObjectId,
        public box_height?: string,
        public box_length?: string,
        public box_width?: string,
        public box_size?: string,
        public description?: string,
        public breadcrumps?: breadcrump[]
        ) { }
}