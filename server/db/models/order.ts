import { ObjectId } from "mongodb";
import User from "./user";

type GetUserContactsTypes<Type> = {
    [Property in keyof Type as Exclude<Property, "cart" | "favorites" | "orders" | "password" | "state" | "unauthorizedId">]: Type[Property]
};

export default class Order {
    constructor(
        public items: ObjectId[],
        public status: "Новый" | "Собирается" | "В пути" | "Ожидает получения" | "Получен",
        public _id?: ObjectId,
        public contacts?: GetUserContactsTypes<User> & Required<Pick<User, 'phone'>>,
    ) { }
}