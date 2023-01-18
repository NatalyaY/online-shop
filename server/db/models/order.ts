import { ObjectId } from "mongodb";
import Product from "./product";
import User from "./user";

type GetUserContactsTypes<Type> = {
    [Property in keyof Type as Exclude<Property, "cart" | "favorites" | "orders" | "password" | "state" | "unauthorizedId">]: Type[Property]
};

interface Item {
    id: ObjectId,
    qty: number,
    price: Product['price'],
    salePrice: Product['salePrice'],
    discount: Product['discount']
};

export default class Order {
    constructor(
        public items: Item[],
        public totalPrice: Product['price'],
        public totalSalePrice: Product['salePrice'],
        public totalDiscount: Product['discount'],
        public status: "Новый" | "В сборке" | "В пути" | "Ожидает получения" | "Получен",
        public UUID: string,
        public contacts: GetUserContactsTypes<User> & Required<Pick<User, 'phone'>>,
        public creationDate: number,
        public _id?: ObjectId,
    ) { }
}
