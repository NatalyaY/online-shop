import { ObjectId } from "mongodb";

export default class Product {
    constructor(
        public name: string,
        public price: number,
        public salePrice: number,
        public imagesQty: number,
        public sku: string,
        public amount: number,
        public brand: string,
        public categoryId: string,
        public creationDate: number,
        public popularity: number,
        public discount?: number,
        public _id?: ObjectId,
        public box_height?: string,
        public box_length?: string,
        public box_width?: string,
        public box_size?: string,
        public description?: string,
        ) { }
}