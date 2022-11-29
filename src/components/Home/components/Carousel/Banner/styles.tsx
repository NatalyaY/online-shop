import {
    Banner,
    imagePositionWOMedia,
    MulipleItem,
    button,
    isBannerWithMediaImage,
    isBannerWithMultyItems,
    isBannerWOImage,
    BannerItem,
    imageLabel
} from './types';


import { darken } from "@mui/material";
import { useTheme } from '@mui/material/styles';


const isMultipleItemsBannerWithImage = (item: BannerItem) => {
    return isBannerWithMultyItems(item) && !isBannerWOImage(item);
}

const getPositionStyles = (position: Banner[number]['text']['position'], responsiveTransform: boolean = true, bottomPadding: number) => {
    let positionStyles;
    if (position == 'center') {
        positionStyles = {
            top: '50%',
            left: '50%',
            bottom: null,
            right: null,
            transform: 'translate(-50%, -50%)'
        };
    } else if (position == 'top' || position == 'bottom') {
        positionStyles = {
            top: position == 'top' ? 0 : null,
            bottom: position == 'bottom' ? `${bottomPadding}px` : null,
            left: '50%',
            right: null,
            transform: 'translateX(-50%)',
        };
        if (responsiveTransform) {
            (positionStyles.transform as any) = { xs: position == 'bottom' ? 'translate(-50%, 50%)' : 'translate(-50%, -50%)', md: 'translateX(-50%)' }
        };
    } else {
        positionStyles = {
            left: position == 'left' ? 0 : null,
            right: position == 'right' ? 0 : null,
            top: '50%',
            bottom: null,
            transform: 'translateY(-50%)',
        };
        if (responsiveTransform) {
            (positionStyles.transform as any) = { xs: position == 'right' ? 'translate(50%, -50%)' : 'translate(-50%, -50%)', md: 'translateY(-50%)' }
        };
    };
    return positionStyles;
};



export const cardStyles = (item: BannerItem, bottomPadding: number) => {
    const commonStyles = {
        backgroundColor: item.backgroundColor || 'secondary.main',
        '&:hover img': { transform: 'scale(1.05)' },
        '&:hover .content .MuiBox-root': { ...(isMultipleItemsBannerWithImage(item) ? { pb: 10/8 } : {}) },
        touchAction: 'none'
    };
    const singleCardStyles = {
        width: '100%',
        height: '100%',
        position: 'absolute',
    };
    const multyItemCardStyles = {
        flex: 1,
        borderRadius: 0,
        order: { xs: (item as MulipleItem).orderMobile, md: (item as MulipleItem).order },
        flexBasis: { xs: (item as MulipleItem).orderMobile == 1 ? '100%' : '50%', md: 0 },
        height: { xs: (item as MulipleItem).orderMobile == 1 ? `calc(50% - ${bottomPadding / 2}px)` : `calc(50% + ${bottomPadding / 2}px)`, md: '100%' },
    };

    return { ...commonStyles, ...(isBannerWithMultyItems(item) ? multyItemCardStyles : singleCardStyles) }
};

export const cardActionStyles = (item: BannerItem, bottomPadding: number) => {
    const theme = useTheme();

    return isBannerWithMultyItems(item) ?
        {
            height: '100%',
            '&:hover': { opacity: 1 },
            pb: { xs: item.orderMobile == 1 ? 0 : `${bottomPadding}px`, md: `${bottomPadding}px` },
            ...(isBannerWithMediaImage(item) &&
            {
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    opacity: 1,
                    display: 'block',
                    height: `${bottomPadding}px`,
                    width: '100%',
                    backgroundColor: isBannerWithMediaImage(item) ? (item.text.backgroundColor || 'text.primary') : 'transparent',
                }
            }
            )
        }
        :
        {
            height: '100%',
            p: 35 / 8,
            pb: `${bottomPadding}px`,
            [theme.breakpoints.only('md')]: {
                p: 4,
                px: 50 / 8,
                pb: `${bottomPadding}px`,
            },
            [theme.breakpoints.up('lg')]: {
                p: 4,
                px: 100 / 8,
                pb: `${bottomPadding}px`,
            },
            '&:hover': { opacity: 1 }
        }
};

export const absPosionedContentStyles = (item: BannerItem, bottomPadding: number) => {
    return {
        position: 'absolute',
        ...getPositionStyles(item.text.position, false, bottomPadding),
        textAlign: item.text.position == 'center' || item.text.position == 'right' ? 'center' : 'left',
        width: (item.text.position == 'top' || item.text.position == 'bottom' || item.text.position == 'center') ?
            '100%' : 'fit-content',
        maxWidth: (item.text.position == 'top' || item.text.position == 'bottom' || item.text.position == 'center') ?
            'unset' : { xs: '100%', md: '55%' },
        p: 0
    };
};

export const imageContainerStyles = (imagePosition: imagePositionWOMedia, margin: number | undefined, bottomPadding: number) => {
    return {
        position: 'absolute',
        ...getPositionStyles(imagePosition, true, bottomPadding),
        maxWidth: (imagePosition == 'top' || imagePosition == 'bottom') ?
            '100%' : '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        ...(margin && imagePosition == 'left' && { marginLeft: { lg: `${margin / 2}px`, xl: `${margin}px` } } || {}),
        ...(margin && imagePosition == 'right' && { marginRight: { lg: `${margin / 2}px`, xl: `${margin}px` } } || {}),
        ...(margin && imagePosition == 'top' && { marginTop: { lg: `${margin / 2}px`, xl: `${margin}px` } } || {}),
        ...(margin && imagePosition == 'bottom' && { marginBottom: { lg: `${margin / 2}px`, xl: `${margin}px` } } || {}),
    }
};

export const textAndButtonContainerStyles = (item: BannerItem, applyAbsPositionStyles: boolean, bottomPadding: number) => {
    const commonStyles = {
        zIndex: 3,
        gap: { xs: 1, md: 2 },
        alignItems: (isBannerWithMultyItems(item) || item.text.position == 'center') ? 'center' : 'flex-start',
        justifyContent: 'center',
    };
    return applyAbsPositionStyles ? { ...absPosionedContentStyles(item, bottomPadding), ...commonStyles } : commonStyles;
};

export const textBoxStyles = (item: BannerItem) => {
    const normalPadding = { xs: isBannerWithMultyItems(item) ? 1 : null, md: isBannerWithMultyItems(item) ? 4 : null };
    return {
        pt: normalPadding,
        px: normalPadding,
        transition: '.2s',
        backgroundColor: isBannerWithMediaImage(item) ? (item.text.backgroundColor || 'text.primary') : 'transparent',
        width: item.text.position == 'center' ? 'fit-content' : '100%',
    }
};

export const textStyles = (item: BannerItem) => {

    const headingDesktopFz = isMultipleItemsBannerWithImage(item) ? '24px' : '50px';
    const headingTabletFz = isMultipleItemsBannerWithImage(item) ? '20px' : '36px';
    const headingMobileFz = isMultipleItemsBannerWithImage(item) ? '18px' : '24px';

    const commonStyles = {
        color: item.text.color || isBannerWithMediaImage(item) ? 'white' : 'unset'
    }
    const captionStyles = {
        ...commonStyles,
        textTransform: 'uppercase',
        fontSize: { xs: '10px', md: '14px' },
    };
    const headingStyles = {
        ...commonStyles,
        whiteSpace: 'pre-line',
        fontSize: { xs: headingMobileFz, sm: headingTabletFz, lg: headingDesktopFz },
        fontWeight: 700
    };

    return { captionStyles, headingStyles }
};

export const imageLabelStyles = (label: imageLabel, position: 'left' | 'right') => {
    return {
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        borderRadius: '50%',
        aspectRatio: '1',
        backgroundColor: label.backgroundColor || 'white',
        position: 'absolute',
        left: position == 'right' ? '50%' : 0,
        top: '0',
        transform: position == 'right' ? 'translateX(50%)' : 'translateX(-50%)',
        zIndex: '2',
        display: { xs: 'none', md: 'flex' }
    }
};

export const imageLabelTextStyles = (label: imageLabel) => {
    const headingWithBeforeStyles = {
        position: 'relative',
        fontSize: '36px',
        color: label.color || '#F05C52',
        ...(label.before ? {
            '&:before': {
                content: label.before,
                color: 'text.primary',
                fontSize: '12px',
                verticalAlign: 'top',
            }
        } : {})
    };
    const subheadingStyles = {
        fontSize: { xs: '12px', md: '14px' }
    }

    return { headingWithBeforeStyles, subheadingStyles };
};

export const imageStyles: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '100%',
    objectFit: 'contain',
    transition: '.2s',
    position: 'relative',
    zIndex: '2',
};

export const imageCircleStyles: React.CSSProperties = {
    borderRadius: '50%',
    width: '200%',
    backgroundColor: '#0000001a',
    zIndex: 1,
    aspectRatio: '1',
    position: 'absolute',
    left: '50%',
    top: '70%',
    transform: 'translate(-50%, -100%)'
};

export const buttonStyles = (button: button) => {
    const theme = useTheme();
    const color = button.backgroundColor || theme.palette.primary.main;

    return {
        backgroundColor: button.backgroundColor || 'primary.main',
        color: button.color || 'primary.contrastText',
        textTransform: 'none',
        fontSize: '12px',
        px: 2,
        py: 1,
        borderRadius: 2,
        gap: 1,
        width: 'fit-content',
        mt: 1,
        flexBasis: '40%',
        lineHeight: '1',
        [theme.breakpoints.up('lg')]: {
            px: 24 / 8,
            py: 14 / 8,
            gap: 20 / 8,
            mt: 24 / 8,
            fontSize: '16px',
            flexBasis: 'auto',
        },
        '&:hover': {
            backgroundColor: darken(color, .2),
            boxShadow: 1
        }
    }
};

export const cardContentStyles: React.CSSProperties = {
    height: '100%',
    width: '100%',
    position: 'relative',
    padding: 0
};