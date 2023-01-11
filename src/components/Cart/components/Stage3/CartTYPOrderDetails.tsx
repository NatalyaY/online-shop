import React from 'react';
import { Typography, Stack } from '@mui/material';
import { NewOrder } from '../../../../common/types';

const CartTYPOrderDetails: React.FC<{ contacts: NewOrder['contacts']; }> = ({ contacts }) => {

    const textStyles = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const textContainersProps = {
        variant: 'h5' as 'h5',
        component: 'p',
        fontWeight: 600,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
    };

    return (
        <Stack flex={'1'} gap={5} flexBasis={'350px'} alignItems={'center'} maxWidth={'100%'}>
            <Typography variant='h2'>Данные для доставки:</Typography>
            <Stack gap={1} maxWidth={'100%'}>
                <Typography {...textContainersProps}>
                    Адрес:
                    <Typography component={'span'} sx={textStyles}>
                        {contacts.address || 'Не указан'}
                    </Typography>
                </Typography>
                <Typography {...textContainersProps}>
                    Телефон:
                    <Typography component={'span'} sx={textStyles}>
                        {contacts.phone || 'Не указан'}
                    </Typography>
                </Typography>
                <Typography {...textContainersProps}>
                    Email:
                    <Typography component={'span'} sx={textStyles}>
                        {contacts.email || 'Не указан'}
                    </Typography>
                </Typography>
                <Typography {...textContainersProps}>
                    Имя:
                    <Typography component={'span'} sx={textStyles}>
                        {contacts.name || 'Не указано'}
                    </Typography>
                </Typography>
            </Stack>
        </Stack>
    );
};

export default CartTYPOrderDetails;

