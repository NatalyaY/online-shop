import { SerializedError } from '@reduxjs/toolkit';
import User from './../../server/db/models/user';
import {
    CategoryInState,
    ProductInState,
    BrandInState,
    FavoriteMapped,
    CartMapped,
    OrderMapped,
    UserMapped,
    params
} from '../../server/helpers';

export type GetAllOptionalTypes<Type> = {
    [Property in keyof Type]?: Type[Property]
};

export interface error {
    status: number,
    message: string
};
export interface withItems<item> {
    lastUpdatedId?: item | ''
};
export interface DBStatus {
    status: "iddle" | "loading" | "succeeded" | "failed"
    error?: error['message'] | SerializedError['message'] | null
};

export type cartState = GetAllOptionalTypes<CartMapped> & DBStatus & withItems<CartMapped['items'][number]>;

export type categoriesState = CategoryInState[];

export type brandsState = BrandInState[];

export type favoritesState = GetAllOptionalTypes<FavoriteMapped> & DBStatus & withItems<FavoriteMapped["items"][number]>;

export type filtersState = Omit<params, '_id' | 's'>;

export interface ordersState extends withItems<OrderMapped["_id"]> {
    orders?: OrderMapped[]
};

export type userState = UserMapped & DBStatus;

export interface productsState extends DBStatus {
    qty?: number,
    queryParams?: { params: params, qty: number, productsBrands: string[], productsCategories: string[], minPrice: number, maxPrice: number }[],
    products: ProductInState[]
};

export interface newOrder {
    items: OrderMapped['items'],
    contacts: OrderMapped['contacts']
};

export { OrderMapped };

export type UserLoginFields = {
    phone: User['phone'],
    password: User['password'],
};
