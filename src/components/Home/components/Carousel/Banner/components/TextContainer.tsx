import React from 'react';
import {
    BannerItem,
} from '../types';
import BannerButton from './BannerButton';
import {
    Typography,
    Box,
    Stack,
} from '@mui/material';

import { textStyles, textAndButtonContainerStyles, textBoxStyles } from '../styles';


const TextContainer: React.FC<{ item: BannerItem, applyAbsPositionStyles: boolean, bottomPadding: number }> = ({ item, applyAbsPositionStyles, bottomPadding }) => {

    const { captionStyles, headingStyles } = textStyles(item);

    return (
        <Stack sx={textAndButtonContainerStyles(item, applyAbsPositionStyles, bottomPadding)}>
            <Box
                sx={textBoxStyles(item)}>
                {item.text.caption && <Typography variant='body1' sx={captionStyles}>{item.text.caption}</Typography>}
                <Typography variant='h1' component={'h3'} sx={headingStyles}>{item.text.title}</Typography>
            </Box>
            {
                item.buttons ?
                    item.buttons.length == 1 ?
                        <BannerButton button={item.buttons[0]} item={item} />
                        :
                        <Stack direction={'row'} gap={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                            {
                                item.buttons.map((button, i) =>
                                    <BannerButton button={button} item={item} key={i + ' button'} endIcon={false} />
                                )
                            }
                        </Stack>
                    : null
            }
        </Stack>
    )
};

export default TextContainer;

