import { ObjectId } from "mongodb";

type StringIds<T> = T extends ObjectId ?
    string
    :
    T extends [ObjectId, ...ObjectId[]] ?
    [string, ...string[]]
    :
    T extends ObjectId[] ?
    string[]
    :
    T extends object[] ?
    { [K in keyof T[number]]: StringIds<T[number][K]> }[]
    :
    T;

export type TypeIds<T> = {
    [K in keyof T]: StringIds<T[K]>;
};

export type MapDbObject<T> = T extends { _id?: unknown } ? TypeIds<Omit<T, '_id'> & { _id: NonNullable<T['_id']> }> : TypeIds<T>