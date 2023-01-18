import React from 'react';
import {
    Typography,
    Container,
    Paper,
    Stack,
    Box,
} from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import { Banner } from './Banner/types';
import BannerComponent from './Banner/Banner';
import useCarousel from '../../../../common/hooks/useCarousel';
import { Package, Delivery, Hours, Shield } from '../../../../common/components/icons';

const Carousel = () => {
    const containerRef = React.useRef(null);

    const time = 300;
    const delay = time + 3000;

    const bannersContent: Banner[] = [
        [{
            images: [{
                src: '/img/banners/aroma/img.png',
                label: {
                    main: '-65%',
                    before: "'до'",
                    after: 'скидки',
                },
                margin: 90,
                position: 'right'
            }],
            text: {
                title: 'Коллекция аромамасел и благовоний для прекрасного настроения',
                caption: 'Создавайте уют',
                position: 'left',
            },
            buttons: [{
                text: 'Смотреть'
            }],
            link: '/categories/cat-2349-aromaterapiya',
        }],
        [{
            images: [{
                src: '/img/banners/child/1.jpg',
                position: 'media',
            }],
            text: {
                title: 'Развивающие игрушки',
                position: 'bottom',
            },
            link: '/categories/podarki-dlya-detey/cat-290-razvivayuschie-igrushki',
            order: 1,
            orderMobile: 2,
        },
        {
            text: {
                title: 'Все для детей',
                caption: 'Для мальчиков и девочек',
                position: 'center',
                color: 'primary.contrastText'
            },

            buttons: [{
                text: 'Коллекция игрушек',
                backgroundColor: '#fff',
                color: 'text.primary'
            }],
            link: '/categories/cat-2510591-podarki-dlya-detey',
            order: 2,
            orderMobile: 1,
            backgroundColor: 'primary.main',
        },
        {
            images: [{
                src: '/img/banners/child/2.jpg',
                position: 'media',
            }],
            text: {
                title: 'Куклы и аксессуары',
                position: 'bottom',
            },
            link: '/categories/podarki-dlya-detey/cat-334-kukly-i-aksessuary',
            order: 3,
            orderMobile: 3,
        },
        ],
        [{
            images: [
                {
                    src: '/img/banners/inter/1.png',
                    label: {
                        main: '55%',
                        after: 'скидка',
                    },
                    position: 'left',
                    margin: 90
                },
                {
                    src: '/img/banners/inter/2.png',
                    label: {
                        main: '55%',
                        after: 'скидка',
                    },
                    position: 'right',
                    margin: 90
                },
            ],
            text: {
                title: 'Уютные мелочи \nдля вашего интерьера',
                caption: 'лучшее для дома',
                position: 'center',
                color: '#fff'
            },
            buttons: [
                {
                    text: 'Свечи',
                    backgroundColor: '#fff',
                    color: 'text.primary',
                    link: '/categories/interer/cat-2745-svechi'
                },
                {
                    text: 'Светильники',
                    backgroundColor: '#fff',
                    color: 'text.primary',
                    link: '/categories/interer/cat-2527-svetilniki-i-nochniki'
                },
                {
                    text: 'Фигурки с янтарем',
                    backgroundColor: '#fff',
                    color: 'text.primary',
                    link: '/categories/interer/cat-2788-figury-iz-latuni-s-yantarem'
                },
                {
                    text: 'Шкатулки',
                    backgroundColor: '#fff',
                    color: 'text.primary',
                    link: '/categories/interer/cat-2448-shkatulki'
                }
            ],
            link: '/categories/cat-2458565-interer',
            backgroundColor: '#a3c2d1'
        }]
    ];

    const arrowsStyle = {
        position: 'absolute',
        top: '0',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        zIndex: 5,
        opacity: .4
    };

    const arrowXPosition = { xs: '-10px', md: 0, lg: '10px' };
    const arrowFZ = { fontSize: { xs: 52, lg: 72 } };

    const { index, direction, handleDot, handleForward, handleBack, onPointerDown, onClick } = useCarousel({ time, delay, itemsQty: bannersContent.length })
    const testimonialsOverlap = 75;
    const dotsVerticalGap = 10;
    const dotsHeight = 12;

    return (
        <Container maxWidth="xxl" sx={{ paddingTop: 4 }}>
            <Box sx={{ position: 'relative' }}>
                <Stack
                    sx={{
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 2,
                        height: {
                            xs: `calc(130vw + ${testimonialsOverlap}px)`,
                            sm: `calc((9/16)*100vw + ${testimonialsOverlap}px)`,
                            md: `calc((1/2.7)*min(100vw, 1700px) + ${testimonialsOverlap}px)`
                        },
                    }}
                    direction='row'
                    ref={containerRef}>
                    {
                        bannersContent.map((settings, i) =>
                            <BannerComponent
                                content={settings}
                                isActive={i == index}
                                key={i}
                                containerRef={containerRef}
                                time={time}
                                onPointerDown={onPointerDown}
                                onClickHandler={onClick}
                                direction={direction}
                                bottomPadding={testimonialsOverlap + dotsHeight + dotsVerticalGap * 2}
                            />
                        )
                    }
                    <Stack sx={{ ...arrowsStyle, left: arrowXPosition }} onClick={handleBack}>
                        <ArrowBackIosRoundedIcon sx={arrowFZ} />
                    </Stack>
                    <Stack sx={{ ...arrowsStyle, right: arrowXPosition }} onClick={handleForward}>
                        <ArrowForwardIosRoundedIcon sx={arrowFZ} />
                    </Stack>
                    <Stack direction={'row'} gap={12 / 8} sx={{ position: 'absolute', bottom: `${dotsVerticalGap + testimonialsOverlap}px`, left: '50%', transform: 'translateX(-50%)' }}>
                        {
                            bannersContent.map((_, i) =>
                                <Dot isActive={i == index} key={i} onClick={() => handleDot ? handleDot(i) : {}} dotsHeight={dotsHeight} />
                            )
                        }
                    </Stack>
                </Stack>
                <Testimonials overlap={testimonialsOverlap} />
            </Box>
        </Container>
    )
};

const Dot: React.FC<{ isActive: boolean, onClick: () => void, dotsHeight: number }> = ({ isActive, onClick, dotsHeight }) => {
    return (
        <Box sx={{
            borderRadius: '50%',
            aspectRatio: '1',
            height: `${dotsHeight}px`,
            backgroundColor: 'text.primary',
            opacity: isActive ? 1 : 0.4,
            border: '1px solid',
            borderColor: 'secondary.main',
            zIndex: 5,
            cursor: 'pointer',
        }}
            onClick={onClick}
        />
    )
}

const Testimonials: React.FC<{ overlap: number }> = ({ overlap }) => {
    return (
        <Container
            maxWidth="xl"
            sx={{
                mt: -`${overlap}` / 8,
                mb: 40 / 8,
                position: 'relative',
            }}>
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                    py: 50 / 8,
                    px: { xs: 20 / 8, md: 70/8},
                    boxShadow: '0px 24px 100px rgba(22, 25, 50, 0.07)',
                }}
            >
                <Stack direction={'row'} gap={2} sx={{ flex: 1, flexWrap: {xs: 'wrap', sm: 'nowrap' }}} justifyContent={'space-around'}>
                    <Testimonial mainText='Скидки' secondaryText='Распродажи каждую неделю'>
                        <Package />
                    </Testimonial>
                    <Testimonial mainText='Бесплатная доставка' secondaryText='100% бесплатно для всех заказов'>
                        <Delivery />
                    </Testimonial>
                </Stack>
                <Stack direction={'row'} gap={2} sx={{ flex: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }} justifyContent={'space-around'}>
                    <Testimonial mainText='Поддержка 24/7' secondaryText='Мы заботимся о вашем удобстве'>
                        <Hours />
                    </Testimonial>
                    <Testimonial mainText='Безопасная оплата' secondaryText='100% безопасные способы оплаты'>
                        <Shield />
                    </Testimonial>
                </Stack>

            </Paper>
        </Container>
    )
};

const Testimonial: React.FC<{ children: React.ReactNode, mainText: string, secondaryText: string }> = ({ children, mainText, secondaryText }) => {
    return (
        <Stack direction={'row'} gap={1} sx={{flex: '1 1 0', alignItems: 'flex-start', minWidth: {xs: '100%', sm: 'auto'}}}>
            {children}
            <Stack>
                <Typography variant="body1" sx={{ fontSize: {xs: '14px', md: '18px'}, fontWeight: 500, whiteSpace: 'nowrap' }}>{mainText}</Typography>
                <Typography variant="body1" sx={{ fontSize: { xs: '12px', md: '15px' }, color: 'secondary.light' }}>{secondaryText}</Typography>
            </Stack>
        </Stack>
    )
}

export default Carousel;