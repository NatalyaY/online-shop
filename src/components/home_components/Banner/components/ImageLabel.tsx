import React from 'react';
import {
    imageLabel,
} from '../../../../common/types';

import {
    Typography,
    Stack,
} from '@mui/material';

import { imageLabelStyles, imageLabelTextStyles } from '../styles';

const Label: React.FC<{ label: imageLabel, position: 'left' | 'right' }> = ({ label, position }) => {
    const { headingWithBeforeStyles, subheadingStyles } = imageLabelTextStyles(label);
    return (
        <Stack sx={imageLabelStyles(label, position)}>
            <Typography variant="h1" component='span'sx={headingWithBeforeStyles}>
                {label.main}
            </Typography>
            {
                label.after &&
                <Typography variant='body1' sx={subheadingStyles}>{label.after}</Typography>
            }
        </Stack>
    )

};

export default Label;