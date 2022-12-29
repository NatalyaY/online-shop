import { ObjectId } from "mongodb";
import Product from "./product";
import User from "./user";

type GetUserContactsTypes<Type> = {
    [Property in keyof Type as Exclude<Property, "cart" | "favorites" | "orders" | "password" | "state" | "unauthorizedId">]: Type[Property]
};

export default class Order {
    constructor(
        public items: { id: ObjectId, qty: number, price: Product['price'], salePrice: Product['salePrice'], discount: Product['discount']}[],
        public totalPrice: Product['price'],
        public totalSalePrice: Product['salePrice'],
        public totalDiscount: Product['discount'],
        public status: "Новый" | "Собирается" | "В пути" | "Ожидает получения" | "Получен",
        public UUID: string,
        public contacts: GetUserContactsTypes<User> & Required<Pick<User, 'phone'>>,
        public _id?: ObjectId,
    ) { }
}