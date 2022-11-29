import { PayloadAction, CaseReducer, createAsyncThunk, ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { error, DBStatus, withItems } from '../common/types';
import { EditUserMapped } from '../../server/helpers';

type features = 'carts' | 'favorits' | 'products' | 'user';

interface DBItems<item> extends withItems<item> {
    items?: item[]
}

function isDBUser(obj: any): obj is EditUserMapped {
    return obj.hasOwnProperty('name')
}

function isDBItems<A>(obj: object & { lastUpdatedId?: A | '' }): obj is DBItems<A> {
    return obj.hasOwnProperty('lastUpdatedId')
}

type Setters<Type> = {
    [Property in keyof Type as `set${Capitalize<string & Property>}`]-?: CaseReducer<Type, PayloadAction<Required<Type>[Property]>>
};

type Clearers<Type> = {
    [Property in keyof Type as `clear${Capitalize<string & Property>}`]-?: CaseReducer<Type>
};

type NarrowThunk<T, A> = T extends { lastUpdatedId?: A } ? AsyncThunk<A, A, {
    rejectValue: {
        message: error['message'];
        item: A;
    };
}> : AsyncThunk<EditUserMapped, EditUserMapped, {
    rejectValue: {
        message: error['message'];
        item: EditUserMapped;
    };
}>;


type UserOrItemsWithStatus<T, A> =
    T extends Record<string, never> ?
    never
    : T extends DBStatus ?
    T extends (DBItems<A> | EditUserMapped) ?
    DBItems<A> & DBStatus | EditUserMapped & DBStatus
    : never
    : never

function typedKeys<T>(o: { [K in keyof T]: T[K] }): (keyof T)[] {
    return Object.keys(o) as (keyof T)[];
};

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
};

export function getClearers<T>(obj: { [K in keyof T]: T[K] }): Clearers<T> {
    return typedKeys(obj).reduce((acc, cur) => {
        const newKey = `set${cur.toString().toUpperCase()}` as keyof Clearers<T>;
        (acc[newKey] as CaseReducer<T>) = (state) => {
            const key = cur as keyof typeof state;
            delete state[key];
        };
        return acc;
    }, {} as Clearers<T>)
};

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
                body: JSON.stringify({ item })
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
                body: JSON.stringify({ item })
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
    const extraReducers = (builder: ActionReducerMapBuilder<typeof obj>) => builder
        .addCase(addThunk.fulfilled, (state, action) => {
            if (isDBUser(state)) {
                const data = action.payload;
                typedKeys(data as EditUserMapped).forEach(key => {
                    state[key] = (data as EditUserMapped)[key]
                });
            };
            state.status = 'succeeded';
            return state
        })
        .addCase(addThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ? action.payload.message : action.error.message;
            if (isDBItems(state)) {
                if (state.items && state.items.length && action.payload !== undefined) {
                    const IDToRemove = action.payload.item;
                    (state.items as A[]) = (state.items as A[]).filter(id =>
                        id !== IDToRemove
                    );
                };
            };
            return state
        })
        .addCase(addThunk.pending, (state, action) => {
            if (isDBItems(state)) {
                const items = state.items ? state.items : [];
                (items as typeof action.meta.arg[]).push(action.meta.arg);
                state.items = items;
                (state.lastUpdatedId as typeof action.meta.arg) = action.meta.arg;
            };
            state.status = 'loading';
            delete state.error;
            return state
        })
        .addCase(removeThunk.fulfilled, (state, action) => {
            if (isDBUser(state)) {
                const data = action.payload;
                typedKeys(data as EditUserMapped).forEach(key => {
                    delete state[key as keyof typeof state]
                });
            };
            state.status = 'succeeded';
            return state;
        })
        .addCase(removeThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ? action.payload.message : action.error.message;
            if (isDBItems(state)) {
                const items = state.items ? state.items : [];
                (items as typeof action.meta.arg[]).push(action.meta.arg);
                state.items = items;
            };
            return state;
        })
        .addCase(removeThunk.pending, (state, action) => {
            if (isDBItems(state)) {
                if (state.items && state.items.length) {
                    (state.items as A[]) = (state.items as A[]).filter(id =>
                        id !== action.meta.arg
                    );
                };
                (state.lastUpdatedId as typeof action.meta.arg) = action.meta.arg;
            };
            state.status = 'loading';
            delete state.error;
            return state;
        })
    return { addThunk: addThunk as NarrowThunk<T, A>, removeThunk: removeThunk as NarrowThunk<T, A>, extraReducers: extraReducers as (builder: ActionReducerMapBuilder<T>) => ActionReducerMapBuilder<T> }
}
