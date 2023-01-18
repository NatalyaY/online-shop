import React, { memo } from 'react';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax';
import { animated, useChain, useInView, useSpring, config, useTrail, useSpringRef } from '@react-spring/web';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { Delivery, Hours, Package } from '../common/components/icons';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import useMediaQuery from '@mui/material/useMediaQuery';

const St = animated(Stack);
const TP = animated(Typography);


const Brand: React.FC<{}> = () => {
    const isSmallHeight = useMediaQuery('(max-height: 600px)');
    const pages = isSmallHeight ? 7.5 : 6.8;

    const parallax = React.useRef<IParallax>(null!);
    const { scroll, scrollHeight, moveX } = useScroll(parallax);

    const [opacityProp, opacityPropApi] = useSpring(() => ({
        opacity: 0,
        y: 0,
    }));

    const [moveXProp, moveXApi] = useSpring(() => ({
        x: 0,
    }));

    const [moveXReversedProp, moveXReversedApi] = useSpring(() => ({
        x: 0,
    }));

    const [moveXSlowedProp, moveXSlowedApi] = useSpring(() => ({
        x: 0,
    }));

    React.useEffect(() => {
        if (scroll / scrollHeight > 0.001) {
            opacityPropApi.start({ opacity: 1, y: 0 })
        } else {
            opacityPropApi.start({ opacity: 0, y: 2000 });
        }
    }, [scroll]);

    React.useEffect(() => {
        let x = -moveX * (Math.random() * 10 + 1);
        if (Math.abs(x) > 100) {
            x = 100 * Math.sign(x);
        };
        moveXApi.start({ x });
        moveXReversedApi.start({ x: -x * 2 });
        moveXSlowedApi.start({ x: x * 0.5 });
    }, [moveX]);


    let opacity = 1 - (scroll / scrollHeight || 0);
    if (opacity < 0.5) opacity = 0.5;

    const marginTop = scrollHeight ? scroll / scrollHeight * -250 - 20 : -20;
    const marginBottom = scrollHeight ? scroll / scrollHeight * -150 : 0;

    return (
        <Parallax ref={parallax} pages={pages}>
            <ParallaxLayer
                offset={0}
                speed={2.5}
                factor={pages}
                style={{
                    background: 'linear-gradient(180deg, #FFBFA7 0%, #FFEE95 100%)'
                }}
            />
            <ParallaxLayer sticky={{ start: 0, end: pages }}>
                <img src={'/img/left.webp'} style={{ marginLeft: '-15px', maxWidth: '70%', maxHeight: '90%', opacity, marginTop }} />
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 0, end: pages }} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <img src={'/img/right.webp'} style={{ maxHeight: '50vmax', marginRight: '-7%', marginBottom: '-15%', position: 'relative', bottom: marginBottom }} />
            </ParallaxLayer>
            <ParallaxLayer offset={0} speed={-0.7}>
                <animated.img src={'/img/sphere.webp'} style={{ marginLeft: '70%', marginTop: '15%', position: 'relative', ...moveXReversedProp }} />
            </ParallaxLayer>
            <ParallaxLayer offset={0} speed={-1.3} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                <animated.img src={'/img/cube_smooth.webp'} style={{ marginLeft: '-5%', marginTop: '5%', maxWidth: '10%', minWidth: '120px', position: 'relative', ...moveXProp }} />
            </ParallaxLayer>
            <ParallaxLayer offset={0} speed={0} style={{ width: '100%', height: '100vh' }}>
                <animated.img src={'/img/disk.webp'} style={{ ...moveXSlowedProp, left: scroll / 20 + 30 + '%', top: scroll / 200 + 85 + '%', maxWidth: '30%', position: 'relative' }} />
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 1.3, end: 3 }} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                <Leafs />
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 0.01, end: 0.01 }} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                <animated.img src={'/img/cube.webp'} style={{ ...moveXProp, maxWidth: '35%', minWidth: '120px' }} />
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 0, end: 1 }}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant='h1' mb={3} color={'primary.light'} display={'inline'} textTransform={'uppercase'}>О бренде Gifty</Typography>
                <animated.div style={{ ...opacityProp, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant='h3' fontWeight={600} color={'white'} textAlign={'center'}>
                        Мы стремимся сделать для вас шоппинг
                        {<br />}
                        удобным и доступным
                    </Typography>
                </animated.div>
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 1.7, end: 2.7 }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Metrics />
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 2, end: 2 }} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                <animated.img src={'/img/sphere_big.webp'} style={{ ...moveXSlowedProp, marginLeft: '-5%', marginTop: '5%', maxWidth: '40%', minWidth: '120px' }} />
            </ParallaxLayer>
            <ParallaxLayer sticky={{ start: 3.5, end: 4.5 }}>
                <Testimanials />
            </ParallaxLayer>
            <ParallaxLayer offset={5.8}>
                <Mission />
            </ParallaxLayer>
        </Parallax>
    )
};

const useScroll = (parallax: React.MutableRefObject<IParallax>) => {
    const [scroll, setScroll] = React.useState(0);
    const [scrollHeight, setScrollHeight] = React.useState(0);
    const [moveX, setMoveX] = React.useState(0);


    React.useEffect(() => {
        if (!parallax.current) return;
        setScrollHeight(parallax.current.container.current.scrollHeight - window.document.body.clientHeight);
        const handleScroll = () => setScroll(parallax.current.current);
        const handleMouseMove = (e: React.MouseEvent) => setMoveX(e.movementX);

        parallax.current.container.current.addEventListener('scroll', handleScroll);
        parallax.current.container.current.addEventListener('mousemove', handleMouseMove);

        return () => {
            parallax.current.container.current.removeEventListener('scroll', handleScroll);
            parallax.current.container.current.removeEventListener('mousemove', handleMouseMove);
        };

    }, [parallax.current?.container.current]);

    return { scroll, scrollHeight, moveX }
};

const slowConfig = (key: string) => {
    if (key === 'count') {
        return config.slow
    };
    return key === 'opacity' ? { duration: 800 } : {}
};

const Metrics = memo(() => {
    const [ref, isInView] = useInView({ rootMargin: '-150px' });
    const isSmallHeight = useMediaQuery('(max-height: 500px)');

    const theme = useTheme();

    const containerStylesProp = useSpring({
        opacity: isInView ? 1 : 0,
        padding: isInView ? 32 : 0,
        minWidth: isInView ? '70%' : '0',
        minHeight: isInView ? '50%' : '0',
    });

    const leftItemStyles = useSpring({
        opacity: isInView ? 1 : 0,
        x: isInView ? 0 : -1000,
        count: isInView ? 100 : 0,
        caption: '+',
        text: 'брендов на сайте',
        config: slowConfig,
    });
    const centerItemStyles = useSpring({
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 100,
        count: isInView ? 700 : 0,
        caption: '+',
        text: 'заказов в день',
        config: slowConfig,
    });
    const rightItemStyles = useSpring({
        opacity: isInView ? 1 : 0,
        x: isInView ? 0 : 1000,
        count: isInView ? 8000 : 0,
        caption: '+',
        text: 'товаров на сайте',
        config: slowConfig,
    });

    const containerStyles = {
        gap: 2,
        alignItems: 'center',
        border: '10px solid',
        borderColor: 'primary.main',
        maxWidth: '80%',
        maxHeight: '80%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: '10px',
        margin: '0 auto',
        justifyContent: 'space-evenly',
        backgroundColor: '#ffffffa1'
    };

    return (
        <St ref={ref} sx={containerStyles} style={containerStylesProp}>
            {[leftItemStyles, centerItemStyles, rightItemStyles].map(({ count, caption, text, ...styles }, i) => (
                <St key={text.get()} style={styles} alignItems={'center'} textAlign={'center'}>
                    <TP color={'primary.main'} fontWeight={600} fontSize={isSmallHeight ? '1.75rem' : theme.typography.h1.fontSize}>
                        {count.to(x => Math.round(x).toLocaleString('ru') + caption.get())}
                    </TP>
                    <Typography fontSize={isSmallHeight ? '1rem' : theme.typography.h4.fontSize} color={'secondary.dark'}>
                        {text.get()}
                    </Typography>
                </St>
            ))}
        </St>
    )
});

const Testimanials = memo(() => {
    const isSmallHeight = useMediaQuery('(max-height: 500px)');

    const [ref, isInView] = useInView({
        rootMargin: '-10%',
    });

    const theme = useTheme();
    const HeaderApi = useSpringRef();
    const ItemsApi = useSpringRef();

    const HeaderStyles = useSpring({
        ref: HeaderApi,
        opacity: isInView ? 1 : 0,
        width: isInView ? '100%' : '0%',
        config: { duration: 1000 },
    });

    const data = [
        {
            title: 'Быстрая доставка',
            subtitle: 'Более 80%',
            text: 'доставляется на следующий день',
            icon: <Delivery sx={{ fontSize: isSmallHeight ? '45px' : '60px' }} />
        },
        {
            title: 'Скидки и распродажи',
            subtitle: 'До 90%',
            text: 'скидки каждую неделю',
            icon: <Package sx={{ fontSize: isSmallHeight ? '45px' : '60px' }} />
        },
        {
            title: 'Поддержка 24/7',
            subtitle: 'До 85%',
            text: 'обращений решаем в тот же день',
            icon: <Hours sx={{ fontSize: isSmallHeight ? '45px' : '60px' }} />
        },
        {
            title: 'Большой выбор',
            subtitle: '1 500+',
            text: 'товаров мы ежедневно отправляем нашим покупателям',
            icon: <AppsRoundedIcon sx={{ fontSize: isSmallHeight ? '45px' : '60px' }} />
        }
    ];

    const trails = useTrail(data.length, {
        ref: ItemsApi,
        from: { opacity: 0, scale: 0 },
        to: {
            scale: isInView ? 1 : 0,
            opacity: isInView ? 1 : 0,
        },
        config: { ...config.wobbly, tension: 120, },
    });

    useChain(isInView ? [HeaderApi, ItemsApi] : [ItemsApi, HeaderApi], [0, isInView ? 0.3 : 0,]);

    return (
        <Stack gap={{ xs: 2, sm: 5 }} ref={ref} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} textAlign={'center'}>
            <TP style={HeaderStyles} fontWeight={600} fontSize={theme.typography.h1.fontSize} color={'primary.light'} textTransform={'uppercase'}>
                Gifty - это
            </TP>
            <St direction={'row'} flexWrap={'wrap'} gap={{ xs: 2, sm: 4 }} maxWidth={isSmallHeight ? '90%' : '60%'} alignItems={'center'} justifyContent={'center'}>
                {trails.map((style, i) => {
                    const {scale, ...rest} = style;
                    const transform = scale.to(x => `scale(${x.toString()})`)
                    return (
                        <St key={data[i].title} style={{flex: '0 0 45%'}}>
                            <St style={{ alignItems: 'center', justifyContent: 'center', transform, ...rest }}>
                                {
                                    data[i].icon
                                }
                                <Typography fontSize={{ xs: '1.2rem', sm: isSmallHeight ? '1.2rem' : theme.typography.h2.fontSize }} component={'span'}>
                                    {data[i].title}
                                </Typography>
                                <Typography variant='h4' display={{ xs: 'none', md: 'block' }} fontWeight={600} component={'span'}>
                                    {data[i].subtitle}
                                </Typography>
                                <Typography variant='h5' display={{ xs: 'none', md: 'block' }} component={'span'} color={'secondary.dark'}>
                                    {data[i].text}
                                </Typography>
                            </St>
                        </St>
                    )
                })}
            </St>
        </Stack>
    )
});

const Mission = memo(() => {

    const isSmallHeight = useMediaQuery('(orientation:landscape) and (max-height: 600px)');
    const [ref, isInView] = useInView({
        rootMargin: '-150px',
    });

    const headerStylesProps = useTrail(2, {
        width: isInView ? '100%' : '0%',
        backgroundColor: isInView ? 'transparent' : 'white',
        config: { duration: 1000 },
        delay: 300
    });

    const containerStyles = {
        gap: { xs: 2, md: 4 },
        backgroundColor: 'primary.main',
        color: 'white',
        p: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, sm: 6 },
        width: '100%',
        borderRadius: '20px',
        justifyContent: 'space-around',
        minHeight: '100vh',
    };

    const headerStyles = {
        fontSize: { xs: '1.2rem', sm: isSmallHeight ? '1.2rem' : '2rem', md: '3rem' },
        border: { xs: '5px solid white', md: '10px solid white' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, md: 2 },
        textAlign: 'center',
        minWidth: '200px',
        height: '100%'
    };

    const textStyles = {
        fontSize: { xs: '0.775rem', sm: isSmallHeight ? '0.775rem' : '1rem' }
    };

    const subHeaderStyles = {
        fontSize: { xs: '1rem', sm: isSmallHeight ? '1rem' : '1.35rem' },
        fontWeight: 600
    };

    const subContainerStyles = {
        flexDirection: 'row',
        gap: { xs: 2, md: 4 },
        alignItems: 'stretch',
        justifyContent: 'space-between',
    };

    return (
        <St ref={ref} sx={containerStyles}>
            <Stack sx={subContainerStyles} flexWrap={'wrap'}>
                <Stack flex={1}>
                    <TP style={headerStylesProps[0]} sx={headerStyles} >
                        Наша миссия
                    </TP>
                </Stack>
                <Typography flex={1} sx={textStyles} minWidth={'250px'} alignSelf={'flex-start'}>
                    Мы стремимся использовать технологии, логистику и инновации, чтобы всегда быть на шаг впереди потребностей наших клиентов.
                    Представляя доступ к продукции как от международных поставщиков, так и от небольших местных производителей,
                    мы стараемся улучшать жизнь и создавать новые возможности для всех жителей России, независимо от их
                    расположения — от самого удаленного уголка страны до ее столицы.
                </Typography>
            </Stack>
            <Stack sx={subContainerStyles} flexWrap={'wrap-reverse'}>
                <Stack gap={2} flex={1} minWidth={'250px'} direction={isSmallHeight ? 'row' : 'column'}>
                    <Stack>
                        <Typography sx={subHeaderStyles}>Человечность</Typography>
                        <Typography sx={textStyles}>
                            Мы общаемся с людьми на их языке и избегаем любых ассоциаций со сложными технологиями.
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography sx={subHeaderStyles}>Открытость</Typography>
                        <Typography sx={textStyles}>
                            Мы стремимся лучше узнать своих пользователей и ценим обратную связь.
                            Поэтому строим открытый бренд — общительный, искренний и дружелюбный.
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography sx={subHeaderStyles}>Гибкость</Typography>
                        <Typography sx={textStyles}>
                            Мы гибко адаптируемся, опережая потребности и запросы наших клиентов и не покладая рук
                            работаем над тем, чтобы превосходить их ожидания.
                        </Typography>
                    </Stack>
                </Stack>
                <Stack flex={1}>
                    <TP style={headerStylesProps[1]} sx={headerStyles}>
                        Наши ценности
                    </TP>
                </Stack>
            </Stack>
        </St>
    )
});

const Leafs = memo(() => {
    const first = useSpring({
        from: {
            transform: 'rotateZ(0deg)',
            right: '0%',
            top: '0%'
        },
        to: { transform: 'rotateZ(360deg)', right: '105%', top: '65%' },
        loop: { reverse: true },
        config: { duration: 20000 }
    });
    const second = useSpring({
        from: {
            transform: 'rotateZ(360deg)',
            right: '90%',
            top: '50%'
        },
        to: { transform: 'rotateZ(0deg)', right: '-10%', top: '5%' },
        loop: { reverse: true },
        config: { duration: 15000 }
    });
    const third = useSpring({
        from: {
            transform: 'rotateZ(90deg)',
            right: '50%',
            top: '30%'
        },
        to: { transform: 'rotateZ(0deg)', right: '30%', top: '95%' },
        loop: { reverse: true },
        config: { duration: 10000 }
    });

    const commonStyles = {
        marginTop: '5%',
        position: 'relative' as 'relative',
        maxWidth: '10%',
        minWidth: '120px',
    };

    return (
        <>
            <animated.img src={'/img/leaf.webp'} style={{
                ...commonStyles,
                ...first
            }} />
            <animated.img src={'/img/leaf1.webp'} style={{
                ...commonStyles,
                ...second
            }} />
            <animated.img src={'/img/leaf2.webp'} style={{
                ...commonStyles,
                ...third
            }} />
        </>
    )
});

export default Brand;