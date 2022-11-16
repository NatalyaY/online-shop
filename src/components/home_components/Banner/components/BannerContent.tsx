import React from 'react';
import {
    BannerItem,
    isBannerWithMediaImage,
    imagePositionWOMedia,
    BannerMediaImage,
} from '../../../../common/types';
import ImageContainer from './ImageContainer';
import TextContainer from './TextContainer';
import {
    CardContent,
    CardMedia,
} from '@mui/material';

import { cardContentStyles, absPosionedContentStyles } from '../styles';


const BannerContent: React.FC<{ item: BannerItem, bottomPadding: number }> = ({ item, bottomPadding }) => {
    if (isBannerWithMediaImage(item)) {
        return <BannerContainerMediaImage item={item} bottomPadding={bottomPadding} />
    } else {
        return <BannerContainerNotMediaImage item={item} bottomPadding={bottomPadding} />
    }
};

const BannerContainerMediaImage: React.FC<{ item: BannerMediaImage, bottomPadding: number }> = ({ item, bottomPadding }) => {
    return (
        <>
            <CardMedia
                component="img"
                image={item.images[0].src}
                alt={item.text.title}
                className='media'
                sx={{ ...cardContentStyles, transition: '.2s'}}
            />
            <CardContent
                sx={absPosionedContentStyles(item, bottomPadding)}
                className='content'
            >
                <TextContainer item={item} applyAbsPositionStyles={false} bottomPadding={bottomPadding} />
            </CardContent>
        </>
    )
};

const BannerContainerNotMediaImage: React.FC<{ item: BannerItem, bottomPadding: number }> = ({ item, bottomPadding }) => {
    return (
        <CardContent sx={cardContentStyles} className='content'>
            <TextContainer item={item} applyAbsPositionStyles={true} bottomPadding={bottomPadding} />

            {
                item.images &&
                (
                    item.images.length == 1 ?
                        <ImageContainer image={item.images[0]} alt={item.text.title} position={(item.images[0].position as imagePositionWOMedia)} bottomPadding={bottomPadding} />
                        :
                        item.images.map((image, i) =>
                            image.position && <ImageContainer key={i} image={image} alt={item.text.title} position={(image.position as imagePositionWOMedia)} bottomPadding={bottomPadding} />
                        )
                )
            }
        </CardContent>
    )
};

export default BannerContent;
