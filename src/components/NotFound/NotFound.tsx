import React from 'react';
import { Container, Stack, Typography, Button } from '@mui/material';
import { noResultsContainerStyles } from '../Catalog/Catalog';

const NotFound: React.FC<{}> = () => {
    return (
        <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8 }} component={'article'}>
            <Stack sx={noResultsContainerStyles('/img/no-page.png')}>
                <Typography variant='h1' sx={{ zIndex: 1 }}>Упс... Нет такой страницы</Typography>
                <Button href='/' variant='outlined' sx={{ mt: 2 }}>На главную</Button>
            </Stack>
        </Container>
    )
}

export default NotFound;
