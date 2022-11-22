import React from 'react';
import {
    Typography,
    Stack,
} from '@mui/material';

import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

const CarouselHeader: React.FC<{ text: string, handleBack: () => void, handleForward: () => void }> = ({ text, handleBack, handleForward }) => {

    const iconsStyle = {
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: 'secondary.main',
        color: 'text.primary',
        fontSize: '44px',
        p: 12 / 8,
        '&:hover': {
            backgroundColor: 'primary.dark',
            color: 'white',
        }
    };

    return (
        <Stack direction={'row'} sx={{ justifyContent: { xs: 'center', sm: 'space-between' }, alignItems: 'center', flexWrap: 'wrap' }} mb={40 / 8} gap={2}>
            <Typography variant='h2' sx={{textAlign: 'center'}}>{text}</Typography>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={18 / 8} sx={{flex: {xs: '1 1 100%', sm: 0}}}>
                <WestIcon onClick={handleBack} sx={iconsStyle} />
                <EastIcon onClick={handleForward} sx={iconsStyle} />
            </Stack>
        </Stack>
    )
}

export default CarouselHeader;