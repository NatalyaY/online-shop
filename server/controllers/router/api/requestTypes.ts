import express from 'express';
import { CartMapped, EditUserMapped, FavoriteMapped, OrderMapped, params, UserMapped } from '../../../helpers';
import { cartState, favoritesState, NewOrder, ordersState, UserChangePasswordFields, UserLoginFields } from '../../../../src/common/types';

export type newOrder = express.Request<{}, OrderMapped, NewOrder>;
export type addToCart = express.Request<{}, { item: CartMapped['items'][number] }, { item: CartMapped['items'][number] }>;
export type removeFromCart = express.Request<{}, { item: CartMapped['items'][number]['id'] }, { item: CartMapped['items'][number]['id'] }>;
export type addToFavorits = express.Request<{}, { item: FavoriteMapped['items'][number] }, { item: FavoriteMapped['items'][number] }>;
export type removeFromFavorits = express.Request<{}, { item: FavoriteMapped['items'][number] }, { item: FavoriteMapped['items'][number] }>;
export type newSubscriber = express.Request<{}, {}, { email: string }>;

export type userLogin = express.Request<{}, { user: UserMapped, cart: cartState, favorits: favoritesState, orders: ordersState }, UserLoginFields>;
export type userSignUp = express.Request<{}, UserMapped, UserLoginFields>;
export type userAddOrRemoveFields = express.Request<{}, EditUserMapped, { item: EditUserMapped }>;
export type userChangePassword = express.Request<{}, {}, UserChangePasswordFields>;


export type customProducts = express.Request<{ limit?: string }, {}, params>



