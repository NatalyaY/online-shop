import { PayloadAction, CaseReducer, createAsyncThunk, ActionReducerMapBuilder, SerializedError, AsyncThunk } from '@reduxjs/toolkit';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppState, AppDispatch } from '../app/store'


export type error = {
    status: number,
    message: string
}

type features =  'carts' | 'favorits' | 'products' | 'user';

interface DBItems<item> {
    items?: item[],
    lastUpdatedId?: item
}

interface DBUser {
    name?: string
}

interface DBStatus {
    status?: "iddle" | "loading" | "succeeded" | "failed"
    error?: error['message'] | SerializedError['message'] | null
}

function isDBUser(obj: any): obj is DBUser {
    return obj.name !== undefined
}

function isDBItems<A>(obj: object & { lastUpdatedId?: A }): obj is DBItems<typeof obj.lastUpdatedId> {
    return obj.lastUpdatedId !== undefined
}

export type Setters<Type> = {
    [Property in keyof Type as `set${Capitalize<
        string & Property
    >}`]-?: CaseReducer<Type, PayloadAction<Required<Type>[Property]>>
};

type Clearers<Type> = {
    [Property in keyof Type as `clear${Capitalize<
        string & Property
    >}`]-?: CaseReducer<Type>
};

function typedKeys<T>(o: { [K in keyof T]: T[K] }): (keyof T)[] {
    return Object.keys(o) as (keyof T)[];
}

export function getSetters<T>(obj: { [K in keyof T]: T[K] }): Setters<T> {
    return typedKeys(obj).reduce((acc, cur) => {
        const val = obj[cur];
        const newKey = `set${cur.toString().toUpperCase()}` as keyof Setters<T>;
        (acc[newKey] as CaseReducer<T, PayloadAction<typeof val>>) = (state, action) => {
            const key = cur as keyof typeof state;
            (state[key] as typeof obj[typeof cur]) = action.payload;
        };
        return acc;
    }, {} as Setters<T>)
}

export function getClearers<T>(obj: { [K in keyof T]: T[K] }): Clearers<T> {
    return typedKeys(obj).reduce((acc, cur) => {
        const newKey = `set${cur.toString().toUpperCase()}` as keyof Clearers<T>;
        (acc[newKey] as CaseReducer<T>) = (state) => {
            const key = cur as keyof typeof state;
            delete state[key];
        };
        return acc;
    }, {} as Clearers<T>)
}

type NarrowThunk<T, A> = T extends { lastUpdatedId?: A } ? AsyncThunk<A, A, {
    rejectValue: {
        message: error['message'];
        item: A;
    };
}> : AsyncThunk<DBUser, DBUser, {
    rejectValue: {
        message: error['message'];
        item: DBUser;
    };
}>;


type UserOrItemsWithStatus<T, A> =
    T extends Record<string, never> ?
    never
    : T extends DBStatus ?
    T extends (DBItems<A> | DBUser) ?
    DBItems<A> & DBStatus | DBUser & DBStatus
    : never
    : never


export function CreateAddRemoveReducers<T, A>(obj: T & UserOrItemsWithStatus<T, A>, featureName: features) {
    const addThunk = createAsyncThunk<
        A,
        A,
        {
            rejectValue: { message: error['message'], item: A }
        }
    >(`${featureName}/add`, async (item, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/${featureName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(item)
            });
            const responseData = await response.json();
            if (responseData.error) {
                return rejectWithValue({ message: (responseData.error as error).message, item })
            } else {
                return responseData;
            };
        } catch (err) {
            return rejectWithValue({ message: (err as error).message, item })
        };
    });
    const removeThunk = createAsyncThunk<
        A,
        A,
        {
            rejectValue: { message: error['message'], item: A }
        }
    >(`${featureName}/remove`, async (item, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/${featureName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(item)
            });
            const responseData = await response.json();
            if (responseData.error) {
                return rejectWithValue({ message: (responseData.error as error).message, item })
            } else {
                return responseData;
            };
        } catch (err) {
            return rejectWithValue({ message: (err as error).message, item })
        };
    });
    const addReducer: CaseReducer<typeof obj, PayloadAction<A>> = (state, action) => {
        if (isDBItems(state)) {
            (state.items as typeof action.payload[])?.push(action.payload);
            (state.lastUpdatedId as typeof action.payload) = action.payload;
        }
        state.status = 'loading';
        delete state.error;
        addThunk(action.payload);
    };
    const removeReducer: CaseReducer<typeof obj, PayloadAction<A>> = (state, action) => {
        if (isDBItems(state)) {
            if (state.items && state.items.length && action.payload !== undefined) {
                const IDToRemove = action.payload;
                (state.items as A[]).filter(id =>
                    id !== IDToRemove
                );
            };
        };
        state.status = 'loading';
        delete state.error;
        addThunk(action.payload);
    };
    const extraReducers = (builder: ActionReducerMapBuilder<typeof obj>) => builder
        .addCase(addThunk.fulfilled, (state, action) => {
            if (isDBUser(state)) {
                const data = action.payload;
                ({ ...state, ...data } as T)
            };
            state.status = 'succeeded';
        })
        .addCase(addThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ? action.payload.message : action.error.message;
            if (isDBItems(state)) {
                if (state.items && state.items.length && action.payload !== undefined) {
                    const IDToRemove = action.payload.item;
                    (state.items as A[]).filter(id =>
                        id !== IDToRemove
                    );
                };
            };
        })
        .addCase(addThunk.pending, (state, action) => {
            if (isDBItems(state)) {
                (state.items as typeof action.meta.arg[])?.push(action.meta.arg);
                (state.lastUpdatedId as typeof action.meta.arg) = action.meta.arg;
            }
            state.status = 'loading';
            delete state.error;
        })
        .addCase(removeThunk.fulfilled, (state, action) => {
            if (isDBUser(state)) {
                const data = action.payload;
                typedKeys(data as DBUser).forEach(key => {
                    delete state[key]
                });
            };
            state.status = 'succeeded';
        })
        .addCase(removeThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ? action.payload.message : action.error.message;
            if (isDBItems(state)) {
                (state.items as typeof action.payload[]).push(action.payload);
            };
        })
        .addCase(removeThunk.pending, (state, action) => {
            if (isDBItems(state)) {
                (state.items as typeof action.meta.arg[])?.push(action.meta.arg);
                (state.lastUpdatedId as typeof action.meta.arg) = action.meta.arg;
            }
            if (isDBItems(state)) {
                if (state.items && state.items.length) {
                    const IDToRemove = action.meta.arg;
                    (state.items as A[]).filter(id =>
                        id !== IDToRemove
                    );
                };
            };
            state.status = 'loading';
            delete state.error;
        })
    return { addThunk: addThunk as NarrowThunk<T, A>, removeThunk: removeThunk as NarrowThunk<T, A>, extraReducers: extraReducers as (builder: ActionReducerMapBuilder<T>) => ActionReducerMapBuilder<T> }
}

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector