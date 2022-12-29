import React from 'react';
import { Typography, Stack } from '@mui/material';
import { NewOrder } from '../../../../common/types';

const CartTYPOrderDetails: React.FC<{ contacts: NewOrder['contacts']; }> = ({ contacts }) => {
    return (
        <Stack flex={'1'} gap={5} flexBasis={'350px'} alignItems={'center'}>
            <Typography variant='h2'>Данные для доставки:</Typography>
            <Stack gap={1}>
                <Typography variant='h5' component={'p'} fontWeight={600}>
                    Адрес:
                    <Typography component={'span'} pl={2} sx={{ verticalAlign: 'middle' }}>
                        {contacts.address || 'Не указан'}
                    </Typography>
                </Typography>
                <Typography variant='h5' component={'p'} fontWeight={600}>
                    Телефон:
                    <Typography component={'span'} pl={2} sx={{ verticalAlign: 'middle' }}>
                        {contacts.phone || 'Не указан'}
                    </Typography>
                </Typography>
                <Typography variant='h5' component={'p'} fontWeight={600}>
                    Email:
                    <Typography component={'span'} pl={2} sx={{ verticalAlign: 'middle' }}>
                        {contacts.email || 'Не указан'}
                    </Typography>
                </Typography>
                <Typography variant='h5' component={'p'} fontWeight={600}>
                    Имя:
                    <Typography component={'span'} pl={2} sx={{ verticalAlign: 'middle' }}>
                        {contacts.name || 'Не указано'}
                    </Typography>
                </Typography>
            </Stack>
        </Stack>
    );
};

export default CartTYPOrderDetails;

