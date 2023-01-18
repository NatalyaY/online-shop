import React from 'react';
import { Container, Typography, Stack, IconButton } from '@mui/material';
import { TelegramIcon, ViberIcon, VKIcon, WhatsappIcon } from '../common/components/icons';

const Contacts: React.FC<{}> = () => {
    return (
        <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8 }} component={'article'}>
            <Typography variant='h1' mb={4}>Контакты</Typography>
            <Typography>Социальные сети и мессенджеры:</Typography>

            <Stack direction={'row'} ml={-1}>
                <IconButton aria-label="ВК" sx={{ color: 'primary.dark' }} target={'_blank'} LinkComponent={'a'} href={'https://vk.com/'}>
                    <VKIcon fontSize='large' />
                </IconButton>
                <IconButton aria-label="Viber" sx={{ color: 'primary.dark' }} target={'_blank'} LinkComponent={'a'} href={'https://www.viber.com/ru/'}>
                    <ViberIcon fontSize='large' />
                </IconButton>
                <IconButton aria-label="Whatsapp" sx={{ color: 'primary.dark' }} target={'_blank'} LinkComponent={'a'} href={'https://web.whatsapp.com/'}>
                    <WhatsappIcon fontSize='large' />
                </IconButton>
                <IconButton aria-label="Telegram" sx={{ color: 'primary.dark' }} target={'_blank'} LinkComponent={'a'} href={'https://web.telegram.org/k/'}>
                    <TelegramIcon fontSize='large' />
                </IconButton>
            </Stack>
        </Container>
    )
}

export default Contacts