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
export interface WithItems<item> {
    lastUpdatedId?: item | ''
};
export interface DBStatus {
    status: "iddle" | "loading" | "succeeded" | "failed"
    error?: error['message'] | SerializedError['message'] | null
};

export type cartState = GetAllOptionalTypes<CartMapped> & DBStatus & WithItems<CartMapped['items'][number]['id']>;

export type categoriesState = CategoryInState[];

export type brandsState = BrandInState[];

export type favoritesState = GetAllOptionalTypes<FavoriteMapped> & DBStatus & WithItems<FavoriteMapped["items"][number]>;

export type filtersState = Omit<params, '_id'>;

export type ordersState = WithItems<OrderMapped["_id"]> & DBStatus & {
    orders?: OrderMapped[]
};

export type userState = UserMapped & DBStatus;

export interface queryParams {
    params: params,
    products: ProductInState[],
    qty: number,
    productsBrands: string[],
    productsCategories: string[],
    minPrice: number,
    maxPrice: number,
    availableBrands: string[],
    availableCategories: string[],
}

export interface productsState extends DBStatus {
    qty?: number,
    queryParams?: queryParams[],
    products: ProductInState[]
};

export interface NewOrder extends Omit<OrderMapped, 'status' | 'UUID' | '_id'> {};

export { OrderMapped };

export type UserLoginFields = {
    phone: User['phone'],
    password: User['password'],
};

export type OverloadedReturnType<T extends (...args: any[]) => any, ARGS_T> =
    Extract<
        T extends { (...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; } ? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4] :
        T extends { (...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; } ? [A1, R1] | [A2, R2] | [A3, R3] :
        T extends { (...args: infer A1): infer R1; (...args: infer A2): infer R2; } ? [A1, R1] | [A2, R2] :
        T extends { (...args: infer A1): infer R1; } ? [A1, R1] :
        never,
        [ARGS_T, any]
    >[1]
