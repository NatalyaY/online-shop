import React from 'react';
import {
    images,
    imagePositionWOMedia,
} from '../types';
import Label from './ImageLabel';
import {
    Box,
    Stack,
} from '@mui/material';

import { imageContainerStyles, imageStyles, imageCircleStyles } from '../styles';


const ImageContainer: React.FC<{ image: images[number], alt: string, position: imagePositionWOMedia, bottomPadding: number }> = ({ image, alt, position, bottomPadding }) => {
    const labelPosition = position == 'left' || position == 'right' ? position : 'right';
    return (
        <Stack
            sx={imageContainerStyles(position, image.margin, bottomPadding)}
        >
            <Box sx={{ height: '100%', maxWidth: '100%', position: 'relative', display: 'flex'}}>

                <img src={image.src} alt={alt} style={imageStyles} />
                {
                    image.label && <Label label={image.label} position={labelPosition} />
                }
                <Box sx={imageCircleStyles} />

            </Box>
        </Stack>
    )
}

export default ImageContainer;