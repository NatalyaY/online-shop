import React from 'react';
import { ToolbarWithWrap, Logo, ResponsiveAccordion } from '../../common/components/styledComponents';
import { VKIcon, ViberIcon, WhatsappIcon, TelegramIcon, VisaIcon, MirIcon, MaestroIcon, MastercardIcon } from '../../common/components/icons';
import useCategories from '../../common/hooks/useCategories';

import {
    Typography,
    AppBar,
    Alert,
    IconButton,
    Container,
    Fade,
    TextField,
    Stack,
    MenuList,
    ListItem,
    Link,
    Divider,
} from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { type Subscribe } from '../../containers/Footer/Footer_container';



const Footer: React.FC<{ Subscribe: Subscribe }> = ({ Subscribe }) => {

    const { topLevelCategories } = useCategories();
    const servicePages = [
        { text: "Доставка и оплата", link: '/delivery' },
        { text: "Контакты", link: '/contacts' },
        { text: "Бренд Gifty", link: '/about' },
        { text: "Политика конфиденциальности", link: '/policy' },
    ];

    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);

    const [isValidated, setIsValidated] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [validationError, setValidationError] = React.useState('');
    const [validationSuccess, setValidationSuccess] = React.useState(false);

    const checkEmail = (value: string) => {
        const isValid = /^\S+@\S+\.\S+$/.test(value);
        setEmailError(!isValid);
        return isValid;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!checkEmail(email)) {
            setEmailError(true);
            return;
        };
        if (validationSuccess) return;
        setLoading(true);

        const res = await Subscribe(email);
        setLoading(false);
        setIsValidated(true);
        if (res.error) {
            setValidationError(res.error.message);
            setTimeout(() => {
                setEmail('');
                setValidationError('');
                setIsValidated(false);
            }, 1000)
        } else {
            setValidationSuccess(true);
            setTimeout(() => {
                setEmail('');
                setValidationSuccess(false);
                setIsValidated(false);
            }, 500)
        }
    };

    const contactButtonProps = {
        target: '_blank',
        LinkComponent: 'a' as 'a',
        sx: {
            border: '1px solid transparent',
            '&:hover': {
                borderColor: 'primary.dark',
                color: 'primary.dark'
            }
        }
    };


    return (
        <AppBar position="relative" sx={{ boxShadow: 0, backgroundColor: 'background.paper' }} component={'footer'}>
            <Divider />
            <Container maxWidth="xl">
                <ToolbarWithWrap sx={{ alignItems: 'flex-start', gap: 2, justifyContent: 'space-between', pl: 0, pr: 0, pt: { xs: 40 / 8, md: 80 / 8 }, pb: { xs: 20 / 8, md: 60 / 8 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Stack gap={1} order={1} sx={{ flex: 0, width: '100%', flexDirection: { xs: 'row', sm: 'column' }, justifyContent: 'space-between' }}>
                        <Logo flexible={false} />
                        <Stack direction={'row'} ml={-1}>
                            <IconButton aria-label="ВК" {...contactButtonProps} href={'https://vk.com/'}>
                                <VKIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="Viber" {...contactButtonProps} href={'https://www.viber.com/ru/'}>
                                <ViberIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="Whatsapp" {...contactButtonProps} href={'https://web.whatsapp.com/'}>
                                <WhatsappIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="Telegram" {...contactButtonProps} href={'https://web.telegram.org/k/'}>
                                <TelegramIcon fontSize='small' />
                            </IconButton>
                        </Stack>
                    </Stack>
                    <Stack
                        direction={'row'}
                        gap={2}
                        order={{ xs: 4, sm: 2 }}
                        sx={{
                            flex: 3,
                            width: '100%',
                            justifyContent: { xs: 'space-between', sm: 'center' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            flexBasis: { xs: '100%', sm: '0' },
                        }}
                    >
                        <ResponsiveAccordion title={'Категории'}>
                            <Stack component={MenuList} gap={1} sx={{ p: 0 }}>
                                {
                                    topLevelCategories.map(category =>
                                        <ListItem key={category._id as unknown as string} sx={{ p: 0, }}>
                                            <Link href={category.breadcrumps![category.breadcrumps!.length - 1].link}>{category.__text}</Link>
                                        </ListItem>
                                    )
                                }
                            </Stack>
                        </ResponsiveAccordion>
                        <ResponsiveAccordion title={'Сервис'}>
                            <Stack component={MenuList} gap={1} sx={{ p: 0 }}>
                                {
                                    servicePages.map((page, i) =>
                                        <ListItem key={i} sx={{ p: 0, }}>
                                            <Link href={page.link}>{page.text}</Link>
                                        </ListItem>
                                    )
                                }
                            </Stack>
                        </ResponsiveAccordion>
                    </Stack>
                    <Stack gap={1} order={3} sx={{ flex: 1, width: '100%', minWidth: '285px' }}>
                        <Typography variant="body1" component={'h6'} textTransform={'uppercase'} sx={{ color: 'text.disabled', fontWeight: 500 }}>Подписка</Typography>
                        <Stack gap={1} direction={'row'} component={'form'} noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
                            <TextField
                                autoComplete='email'
                                error={emailError}
                                id="email"
                                name="email"
                                label="Ваш email"
                                variant="outlined"
                                size="small"
                                sx={{ borderColor: 'text.disabled', flex: 1 }}
                                InputProps={{
                                    required: true,
                                    sx: {
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E1E3E5' },
                                        '& .MuiFormLabel-root': { color: 'text.disabled' }
                                    },
                                }}
                                value={email}
                                onChange={(e) => { checkEmail(e.target.value); setEmail(e.target.value) }}
                            />
                            <LoadingButton size="small" loading={loading} type='submit' disabled={emailError} variant="contained" sx={{ textTransform: 'none' }}>
                                {
                                    <>
                                        <CheckCircleOutlineIcon
                                            sx={{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                opacity: validationSuccess ? 1 : 0
                                            }}
                                        />
                                        <span style={{ opacity: validationSuccess ? 0 : 1 }}>Подписаться</span>
                                    </>
                                }
                            </LoadingButton>
                        </Stack>
                        {
                            validationError != '' && isValidated && !loading &&
                            <Fade in={true}>
                                <Alert severity="error" sx={{ flexBasis: '100%' }}>
                                    {validationError}
                                </Alert>
                            </Fade>
                        }
                        <Typography variant="body1" sx={{ color: 'text.disabled' }}>Подпишитесь на рассылку, и узнавайте первыми о выгодных скидках и акциях</Typography>
                    </Stack>
                </ToolbarWithWrap>
            </Container>
            <Divider />
            <Container maxWidth="xl">
                <Stack direction={'row'} gap={2} sx={{ pt: 27 / 8, pb: 27 / 8, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>&copy; 2022-{new Date().getFullYear()}</Typography>
                    <Stack direction={'row'} gap={1}>
                        <VisaIcon sx={{ height: { xs: 15, sm: 27 }, width: 'auto', filter: 'grayscale(100%)', '&:hover': { filter: 'none' }, transition: '.2s' }} />
                        <MastercardIcon sx={{ height: { xs: 15, sm: 27 }, width: 'auto', filter: 'grayscale(100%)', '&:hover': { filter: 'none' }, transition: '.2s' }} />
                        <MaestroIcon sx={{ height: { xs: 15, sm: 27 }, width: 'auto', filter: 'grayscale(100%)', '&:hover': { filter: 'none' }, transition: '.2s' }} />
                        <MirIcon sx={{ height: { xs: 15, sm: 27 }, width: 'auto', filter: 'grayscale(100%)', '&:hover': { filter: 'none' }, transition: '.2s' }} />
                    </Stack>
                </Stack>
            </Container>
        </AppBar>
    )

};

export default Footer;