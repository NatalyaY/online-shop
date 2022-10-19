'use strict';

const initialState = {
    auth: {
        state: 'iddle',
        user: {
            id: '',
            name: '',
            surname: '',
            phone: '',
            email: '',
            address: {
                city: '',
                street: '',
                house: '',
                flat: '',
            },
        },
    },
    categories: [],
    favorites: [],
    cart: [],
    products: [],
    brands: [],
    filters: {
        minPrice: '',
        maxPrice: '',
        availiability: '',
        category: '',
        brand: '',
    },
    ui: {
        
    }
}