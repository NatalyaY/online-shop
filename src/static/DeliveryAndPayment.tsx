import React from 'react';
import { Container, Typography, Stack, Button, useMediaQuery, Accordion, AccordionDetails, AccordionSummary, Link } from '@mui/material';
import Slide from '@mui/material/Slide';
import PublicIcon from '@mui/icons-material/Public';
import SavingsIcon from '@mui/icons-material/Savings';
import { YMaps, useYMaps } from '@pbe/react-yandex-maps';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MaestroIcon, MastercardIcon, MirIcon, VisaIcon } from '../common/components/icons';

const DeliveryAndPayment: React.FC<{}> = () => {
    return (
        <Container maxWidth="xl" sx={{ pt: 40 / 8, pb: 80 / 8 }} component={'article'}>
            <Typography variant='h1' mb={4}>Доставка и оплата</Typography>
            <YMaps query={{ apikey: '31048ff9-eadf-40c4-96b3-cd6ca36ed0d7' }}>
                <Delivery />
            </YMaps>
            <Payment/>
        </Container>
    )
};

const Delivery: React.FC<{}> = () => {
    const [coords, setCoords] = React.useState<[number, number] | null>(null);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const bannerStyles = {
        color: 'white',
        background: 'linear-gradient(135deg, rgba(34,193,195,0.8) 0%, rgba(253,187,45,0.4) 100%)',
        width: '100%',
        borderRadius: '20px',
        position: 'relative',
        p: 4
    };

    const ref = React.useRef();
    useDeliveryMap({ coords, setCoords, containerRef: ref });

    return (
        <Stack gap={6} component={'section'}>
            <Stack gap={2} sx={bannerStyles}>
                <Typography mb={2} variant='h1' component={'p'} maxWidth={isDesktop ? '70%' : '100%'}>
                    Быстро доставим ваш заказ по всей России
                </Typography>
                <Stack direction={'row'} maxWidth={isDesktop ? '60%' : '100%'} gap={2} zIndex={10} flexWrap={'wrap'}>
                    <Stack direction={'row'} gap={2} alignItems={'center'} flex={'1 1 0'}>
                        <SavingsIcon sx={{ fontSize: isDesktop ? '3.5rem' : '3rem' }} />
                        <Typography variant='h5' component={'span'}>Бесплатная доставка</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={2} alignItems={'center'} flex={'1 1 0'}>
                        <PublicIcon sx={{ fontSize: isDesktop ? '3.5rem' : '3rem' }} />
                        <Typography variant='h5' component={'span'}>Доставка по всей России</Typography>
                    </Stack>
                </Stack>
                <Button variant='contained' sx={{ width: 'fit-content', mt: 4 }}>Узнать подробнее</Button>
                <Slide in={isDesktop} direction={'right'} timeout={800}>
                    <Stack sx={{ position: 'absolute', right: '50px', top: 0, maxWidth: '40%', height: '100%' }} justifyContent={'center'}>
                        <img src="/img/delivery.webp" alt="" className='shake' style={{ maxWidth: '100%', maxHeight: '100%', opacity: '0.6' }} />
                    </Stack>
                </Slide>
            </Stack>
            <Typography variant='h2'>Информация о доставке</Typography>
            <Stack sx={{ borderRadius: '10px', width: '100%', height: '600px', boxShadow: 2 }}>
                <Stack pl={2} mb={2} pt={2}>
                    {
                        coords ?
                            <>
                                <Typography>
                                    Стоимость доставки:
                                    <Typography ml={2} component={'span'} fontWeight={600} color={'primary.main'}>бесплатно</Typography>
                                </Typography>
                                <Typography>
                                    Ближайшая доставка:
                                    <Typography ml={2} component={'span'} fontWeight={600} color={'primary.main'}>
                                        {
                                            deliveryDate.toLocaleDateString('ru', { day: 'numeric', month: 'long' })
                                        }
                                    </Typography>
                                </Typography>
                            </>
                            :
                            <Typography>Выберите адрес на карте</Typography>
                    }
                </Stack>
                <Stack ref={ref} sx={{width: '100%', height: '100%'}}/>
            </Stack>
        </Stack>
    )
};

interface IDeliveryMapProps {
    coords: [number, number] | null,
    setCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>,
    containerRef: React.MutableRefObject<any>
};

const useDeliveryMap = ({ coords, setCoords, containerRef }: IDeliveryMapProps) => {
    const [map, setMap] = React.useState<ymaps.Map | null>(null);
    const [placemark, setPlacemark] = React.useState<ymaps.Placemark | null>(null);
    const [caption, setCaption] = React.useState<string | null>(null);

    const ymaps = useYMaps(
        [
            'Map',
            'Placemark',
            'control.ZoomControl',
            'control.FullscreenControl',
            'control.SearchControl',
            'geocode'
        ]
    );

    const handleMapClick = (e: ymaps.IEvent<MouseEvent, {}>) => {
        if (!ymaps) return;
        const coords = e.get('coords');
        ymaps.geocode(coords).then(function (res: any) {
            const firstGeoObject = res.geoObjects.get(0);
            let caption: string;

            if (firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()) {
                caption = [
                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
                    firstGeoObject.getPremiseNumber()
                ].filter(Boolean).join(', ');
            } else {
                let area = firstGeoObject.getLocalities().length ?
                    firstGeoObject.getLocalities()
                    :
                    firstGeoObject.getAdministrativeAreas();
                caption = area.slice(area.length > 1 ? 1 : 0).join(', ');
            };

            setCaption(caption);
            setCoords(coords);
        });
    };

    React.useEffect(() => {
        if (!ymaps || !containerRef.current || !coords || !map) {
            return;
        };

        if (placemark) {
            placemark.geometry?.setCoordinates(coords);
            placemark.properties.set('iconCaption', caption);
        } else {
            const mark = new ymaps.Placemark(coords, { iconCaption: caption }, { iconColor: '#029FAE', preset: 'islands#dotIcon' });
            setPlacemark(mark);

            map.geoObjects.add(mark);
        };

    }, [coords, caption])

    React.useEffect(() => {
        if (!ymaps || !containerRef.current) {
            return;
        }

        const map = new ymaps.Map(
            containerRef.current,
            {
                center: [55.75, 37.57],
                zoom: 9,
            },
            {
                suppressMapOpenBlock: true,
                yandexMapDisablePoiInteractivity: true,
                suppressObsoleteBrowserNotifier: true
            }
        );

        map.events.add('click', handleMapClick);

        setMap(map);

        const searchControl = new ymaps.control.SearchControl({
            options: { noPopup: true, noPlacemark: true }
        });

        searchControl.events.add('resultselect', (e) => {
            const index = e.get('index');
            const result = searchControl.getResultsArray()[index] as any;
            const coords = result.geometry.getCoordinates();
            setCaption(result.properties.get('name'));
            setCoords(coords);
        });

        map.controls.add(searchControl);
        map.controls.add("zoomControl");
        map.controls.add("fullscreenControl");

    }, [ymaps]);
};

const Payment: React.FC<{}> = () => {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Stack mt={10} component={'section'}>
            <Typography variant='h2'>Способы оплаты</Typography>
            <Typography mb={2}>Понравившиеся вещи вы можете безопасно оплатить любым из способов при получении заказа:</Typography>
            <Accordion disableGutters expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
                    <Typography variant='h4'>Банковская карта</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Оплата картой курьеру при получении заказа.</Typography>
                    <Typography fontWeight={600} mb={2}>
                        Мы принимаем к оплате:
                    </Typography>
                    <Stack direction={'row'} gap={2} flexWrap={'wrap'}>
                        <VisaIcon sx={{ height: { xs: 15, sm: 27 }, width: 'auto' }} />
                        <MastercardIcon sx={{ height: { xs: 15, sm: 27 }, width: 'auto' }} />
                        <MaestroIcon sx={{ height: { xs: 15, sm: 27 }, width: 'auto' }} />
                        <MirIcon sx={{ height: { xs: 15, sm: 27 }, width: 'auto' }} />
                    </Stack>
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2d-content" id="panel2d-header">
                    <Typography variant='h4'>Система быстрых платежей (СБП)</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography>
                        Система быстрых платежей (далее "СБП") - сервис платежной системы Банка России,
                        позволяющий физическим лицам производить оплату за товар/услуги с помощью любого банка-участника СБП.
                    </Typography>
                    <Typography>
                        {'Список банков-участников опубликован на официальном сайте '}
                        <Link component={'a'} href={'https://sbp.nspk.ru/participants/'}>https://sbp.nspk.ru/participants/</Link>
                    </Typography>
                    <Typography>
                        Безопасность переводов обеспечивается на стороне всех банков-участников СБП:
                        банков, Банка России и НСПК с использованием современных систем защиты.
                        СБП соответствует всем стандартам информационной безопасности.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3d-content" id="panel3d-header">
                    <Typography variant='h4'>Наличные</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Вы можете оплатить заказ при получении курьеру наличными.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Stack>
    )
};

export default DeliveryAndPayment;