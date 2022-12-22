import React from 'react';
import { Stack, Typography } from '@mui/material';
import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded';
import { Delivery, Shield } from '../../../common/components/icons';

const ProductTestimonials = () => {
    return (
        <Stack gap={1}>
            <Stack direction={'row'} gap={1}>
                <PublishedWithChangesRoundedIcon color='primary' />
                <Typography>Возврат в течение 14 дней</Typography>
            </Stack>
            <Stack direction={'row'} gap={1} alignItems={'center'}>
                <Delivery color='primary' sx={{ fontSize: '1.5rem' }} />
                <Typography>Бесплатная доставка</Typography>
            </Stack>
            <Stack direction={'row'} gap={1} alignItems={'center'}>
                <Shield color='primary' sx={{ fontSize: '1.5rem' }} />
                <Typography>Безопасная оплата</Typography>
            </Stack>
        </Stack>
    )
};

export default ProductTestimonials;