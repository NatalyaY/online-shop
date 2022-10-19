import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import User from "./../models/user";
import Category from "./../models/category";
import Product from "./../models/product";
import Favorite from './../models/favorite';
import Cart from './../models/cart';
import Order from './../models/order';


export const collections: {
    categories?: mongoDB.Collection<Category>,
    products?: mongoDB.Collection<Product>,
    users?: mongoDB.Collection<User>,
    favorites?: mongoDB.Collection<Favorite>,
    carts?: mongoDB.Collection<Cart>,
    orders?: mongoDB.Collection<Order>,
} = {};

export async function connectToDatabase() {
    dotenv.config();

    const client = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    const categories = db.collection<Category>(process.env.CATEGORIES_COLLECTION_NAME!);
    const products = db.collection<Product>(process.env.PRODUCTS_COLLECTION_NAME!);
    const users = db.collection<User>(process.env.USERS_COLLECTION_NAME!);
    const favorites = db.collection<Favorite>(process.env.FAVORITES_COLLECTION_NAME!);
    const carts = db.collection<Cart>(process.env.CARTS_COLLECTION_NAME!);
    const orders = db.collection<Order>(process.env.ORDERS_COLLECTION_NAME!);

    collections.categories = categories;
    collections.products = products;
    collections.users = users;
    collections.favorites = favorites;
    collections.carts = carts;
    collections.orders = orders;

    console.log(
        `Successfully connected to database: ${db.databaseName} and collection: ${categories.collectionName}`,
    );
}
