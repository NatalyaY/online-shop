import { PayloadAction, CaseReducer, createAsyncThunk, ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { error, DBStatus, WithItems } from '../common/types';
import { EditUserMapped } from '../../server/helpers';
import unify from '../common/helpers/unify';

type features = 'carts' | 'favorits' | 'products' | 'user';

interface DBItems<item> extends WithItems<item> {
    items?: item[]
}

interface DBItemsWithqty<item> extends WithItems<item> {
    items?: { id: item, qty: number }[]
}

const isDBUser = (obj: any): obj is EditUserMapped => {
    return obj.state !== undefined
}

function isDBItems<A>(obj: object & { lastUpdatedId?: A | '', items?: (A | { id: A, qty: number })[] }): obj is DBItems<A> {
    if (obj.hasOwnProperty('lastUpdatedId')) {
        if (obj.items && typeof obj.items[0] != typeof obj.lastUpdatedId) return false;
        return true;
    } else {
        return false;
    }
}

type Setters<Type> = {
    [Property in keyof Type as `set${Capitalize<string & Property>}`]-?: CaseReducer<Type, PayloadAction<Required<Type>[Property]>>
};

type Clearers<Type> = {
    [Property in keyof Type as `clear${Capitalize<string & Property>}`]-?: CaseReducer<Type>
};

type NarrowAddThunk<T, A> = T extends DBItems<A> | DBItemsWithqty<A> ?
    AsyncThunk<A, NonNullable<T['items']>[number], {
        rejectValue: {
            message: error['message'];
            item: A;
        };
    }>
    :
    AsyncThunk<EditUserMapped, EditUserMapped, {
        rejectValue: {
            message: error['message'];
            item: EditUserMapped;
        };
    }>;

type NarrowRemoveThunk<T, A> = T extends DBItems<A> | DBItemsWithqty<A> ? AsyncThunk<A, A, {
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
    T extends Record<string, never> ? never
    : T extends DBStatus ?
    T extends DBItemsWithqty<A> ? DBItemsWithqty<A> & DBStatus
    :
    T extends DBItems<A> ? DBItems<A> & DBStatus
    :
    T extends EditUserMapped ? EditUserMapped & DBStatus
    : never
    : never

function typedKeys<T>(o: { [K in keyof T]: T[K] }) {
    return Object.keys(o) as (string & keyof T)[];
};

export function getSetters<T>(obj: { [K in keyof T]: T[K] }): Setters<T> {
    return typedKeys(obj).reduce((acc, cur) => {
        const newKey = `set${cur[0].toUpperCase() + cur.slice(1)}` as keyof Setters<T>;
        (acc[newKey] as CaseReducer<T, PayloadAction<typeof obj[typeof cur]>>) = (state, action) => {
            const key = cur as keyof typeof state;
            (state[key] as typeof obj[typeof cur]) = action.payload;
        };
        return acc;
    }, {} as Setters<T>)
};

export function getClearers<T>(obj: { [K in keyof T]: T[K] }): Clearers<T> {
    return typedKeys(obj).reduce((acc, cur) => {
        const newKey = `clear${cur[0].toUpperCase() + cur.slice(1)}` as keyof Clearers<T>;
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

    const addFulfilled: CaseReducer<
        typeof obj,
        PayloadAction<A, string,
            {
                arg: A;
                requestId: string;
                requestStatus: "fulfilled";
            }, never
        >>
        =
        (state, action) => {
            if (isDBUser(state)) {
                const data = action.payload as EditUserMapped;
                typedKeys(data).forEach(key => {
                    state[key] = data[key];
                });
            } else {
                let items = state.items || [];
                const { id } = action.meta.arg as any;
                if (isDBItems(state)) {
                    (items as typeof action.meta.arg[]) = unify((items as typeof action.meta.arg[]), [action.meta.arg]);
                } else {
                    const index = (items as NonNullable<typeof state.items>).findIndex(i => i.id == id);
                    if (index !== -1) {
                        (items as typeof action.meta.arg[])[index] = action.meta.arg;
                    } else {
                        (items as typeof action.meta.arg[]).push(action.meta.arg);
                    };
                };
                state.items = items;
                (state.lastUpdatedId as typeof action.meta.arg) = id || action.meta.arg;
            };
            state.status = 'succeeded';
            return state
        };

    const removeFulfilled: CaseReducer<
        typeof obj,
        PayloadAction<A, string, {
            arg: A;
            requestId: string;
            requestStatus: "fulfilled";
        }, never>>
        = (state, action) => {
            if (isDBUser(state)) {
                const data = action.payload;
                typedKeys(data as EditUserMapped).forEach(key => {
                    delete state[key as keyof typeof state]
                });
            } else {
                if (state.items && state.items.length) {
                    (state.items as A[]) = (state.items as A[]).filter(item => {
                        const idInState = (item as any).id || item;
                        return idInState !== action.meta.arg;
                    });
                };
                (state.lastUpdatedId as typeof action.meta.arg) = action.meta.arg;
            };
            state.status = 'succeeded';
            return state;
        };

    const extraReducers = (builder: ActionReducerMapBuilder<typeof obj>) => builder
        .addCase(addThunk.fulfilled, addFulfilled)
        .addCase(removeThunk.fulfilled, removeFulfilled)
        .addCase(addThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ? action.payload.message : action.error.message;
            return state
        })
        .addCase(removeThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ? action.payload.message : action.error.message;
            return state
        })
        .addCase(addThunk.pending, (state, action) => {
            state.status = 'loading';
            delete state.error;
            return state
        })
        .addCase(removeThunk.pending, (state, action) => {
            state.status = 'loading';
            delete state.error;
            return state
        })
    return { addThunk: addThunk as NarrowAddThunk<T, A>, removeThunk: removeThunk as NarrowRemoveThunk<T, A>, extraReducers: extraReducers as (builder: ActionReducerMapBuilder<T>) => ActionReducerMapBuilder<T> }
}
