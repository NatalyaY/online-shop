import React from 'react';
import Footer from '../../components/Footer/Footer';

import { error } from '../../common/types';

export type Subscribe = (email: string) => Promise<{ error?: error }>;

const Footer_container = () => {

    const Subscribe: Subscribe = async (email) => {
        return await (await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ email })
        })).json()
    };

    return <Footer
        Subscribe={Subscribe}
    />
};

export default Footer_container;