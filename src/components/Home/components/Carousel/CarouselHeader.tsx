import React from 'react';
import {
    Typography,
    Stack,
    SxProps,
    Button
} from '@mui/material';

import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

interface ICarouselHeaderProps {
    text: string,
    handleBack: () => void,
    handleForward: () => void,
    noButtons?: boolean,
    backDisabled?: boolean,
    forwardDisabled?: boolean,
    sx?: SxProps
}

const CarouselHeader: React.FC<ICarouselHeaderProps> = ({ text, handleBack, handleForward, noButtons, backDisabled, forwardDisabled, sx }) => {

    const iconsStyle = {
        cursor: 'pointer',
        borderRadius: '50%',
        aspectRatio: '1',
        backgroundColor: 'secondary.main',
        color: 'text.primary',
        p: 12 / 8,
        '&:hover': {
            backgroundColor: 'primary.dark',
            color: 'white',
        }
    };

    const styles: SxProps = {
        justifyContent: { xs: 'center', sm: 'space-between' },
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: '100%',
        mb: 40 / 8,
        gap: 2,
    };

    const buttonsContainerStyles: SxProps = {
        flex: { xs: '1 1 100%', sm: 0 },
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 18 / 8
    };

    return (
        <Stack sx={{ ...styles, ...sx }}>
            <Typography variant='h2' sx={{ textAlign: 'center' }}>{text}</Typography>
            {
                !noButtons &&
                <Stack sx={buttonsContainerStyles}>
                    <Button onClick={handleBack} sx={iconsStyle} disabled={backDisabled}>
                        <WestIcon />
                    </Button>
                    <Button onClick={handleForward} sx={iconsStyle} disabled={forwardDisabled}>
                        <EastIcon />
                    </Button>
                </Stack>
            }
        </Stack>
    )
}

export default CarouselHeader;