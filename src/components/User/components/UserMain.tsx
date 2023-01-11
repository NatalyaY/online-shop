import React from 'react';
import { Paper, Stack, Typography, Link, AvatarGroup, Avatar, Button, SxProps } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import getCorrectTextEndings from '../../../common/helpers/getCorrectTextEndings';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IUserMainProps } from '../User';

const UserMain: React.FC<IUserMainProps> = ({ user, cartProducts, favoritsProducts, orders, ordersProducts }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const activeOrders = orders.orders ? orders.orders.filter(o => o.status != 'Получен') : null;
    const finishedOrders = orders.orders ? orders.orders.filter(o => o.status == 'Получен') : null;

    activeOrders && activeOrders.sort((a, b) => b.creationDate - a.creationDate);
    const activeOrder = activeOrders ? activeOrders[0] : null;
    const activeOrdersCount = activeOrders && activeOrders.length >= 2 ? activeOrders.length - 1 : null;
    const orderCountText = activeOrdersCount && getCorrectTextEndings({
        qty: activeOrdersCount,
        textsArr: ['активный заказ', 'активных заказа', 'активных заказов']
    });

    const orderedSum = orders.orders ? orders.orders.reduce((sum, order) => sum += order.totalSalePrice, 0) : null;
    const purchasedSum = finishedOrders?.length ? finishedOrders.reduce((sum, order) => sum += order.totalSalePrice, 0) : 0;

    const ordersGranient = 'linear-gradient(135deg, rgba(34,193,195,0.3039443155452436) 0%, rgba(253,187,45,0.29698375870069604) 100%)';
    const cardLinkStyles = {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 4
    };
    const iconsStyles = {
        fontSize: { xs: '82px', sm: '108px' },
        p: 2,
        border: '1px solid',
        borderRadius: '50%',
        color: 'primary.main'
    };
    const linkProps: SxProps = {
        component: 'span',
        color: 'primary.main',
        alignSelf: 'flex-end',
    };
    const getAvatarGroupProps = (w: number, qty: number) => {
        return {
            max: qty >= 4 && !isDesktop ? 4 : qty,
            componentsProps: {
                additionalAvatar: {
                    sx: {
                        width: w >= 60 ? { xs: 60, md: w } : w,
                        height: w >= 60 ? { xs: 60, md: w } : w,
                        fontSize: '1.5rem'
                    }
                }
            },
            spacing: 'small' as 'small',
        };
    };
    const getAvatarProps = (w: number, id?: string, alt?: string) => {
        return {
            alt,
            src: `/img/products/${id}/${w + 10}/0.webp`,
            sx: {
                width: w >= 60 ? { xs: 60, md: w } : w,
                height: w >= 60 ? { xs: 60, md: w } : w,
                '&.MuiAvatar-root': {
                    borderColor: '#fdeef9'
                }
            }
        };
    };
    return (
        <>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 6 }, flex: '1', order: 1 }}>
                <Link href={'/my/details'} className='woUnderline' sx={{ ...cardLinkStyles, justifyContent: 'center', gap: 2 }}>
                    <Stack direction={'row'} gap={2} alignItems='center' flexWrap={'wrap'} justifyContent={'center'}>
                        <AccountBoxIcon sx={iconsStyles} />
                        <Typography variant='h2' sx={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{user.name || 'Имя не указано'}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={2} justifyContent={'space-evenly'} width={'100%'} flexWrap={'wrap'}>
                        <Stack>
                            <Typography fontSize={'1rem'} whiteSpace={'nowrap'}>{user.phone || 'Телефон не указан'}</Typography>
                            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }} fontSize={'1rem'} whiteSpace={'nowrap'}>{user.email || 'Email не указан'}</Typography>
                        </Stack>
                        <Link {...linkProps}>Личные данные</Link>
                    </Stack>
                </Link>
            </Paper>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 6 }, flex: '2', background: ordersGranient, order: { xs: 3, lg: 2 }, flexBasis: { xs: '100%', lg: '0' } }}>
                <Link href={'/my/orders'} className='woUnderline' sx={cardLinkStyles}>
                    <Typography variant='h2'>Активные заказы</Typography>
                    {activeOrder ?
                        <Stack gap={1} width={'100%'}>
                            <Paper
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    gap: 2,
                                    p: 3,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <AvatarGroup {...getAvatarGroupProps(76, 4)}>
                                    {activeOrder.items.map(item => {
                                        const product = ordersProducts.find(p => p.id == item.id)?.product;
                                        return (
                                            <Avatar
                                                key={item.id + 'ordered'}
                                                {...getAvatarProps(76, product?._id, product?.name)} />
                                        );
                                    })}
                                </AvatarGroup>
                                <Stack alignItems={'flex-start'} width={'min-content'} direction={'row'} flexWrap={'wrap'} gap={1}>
                                    <Typography variant='h6' color={'primary.main'} whiteSpace={'nowrap'}>
                                        {'Заказ №' + activeOrder.UUID}
                                    </Typography>
                                    <Typography whiteSpace={'nowrap'}>
                                        {`Статус: ${activeOrder.status}`}
                                    </Typography>
                                    <Typography fontSize={'1.15rem'} fontWeight={600} whiteSpace={'nowrap'}>
                                        {`${activeOrder.totalSalePrice.toLocaleString('ru-RU')} ₽`}
                                    </Typography>
                                </Stack>
                            </Paper>
                            {activeOrdersCount &&
                                <Typography>{`И еще ${activeOrdersCount} ${orderCountText}`}</Typography>}
                        </Stack>
                        :
                        <Typography fontSize={'1.25rem'} fontWeight={600}>Нет активных заказов</Typography>}
                    <Button variant='contained' sx={{ width: 'fit-content', alignSelf: 'flex-end' }}>Мои заказы</Button>
                </Link>
            </Paper>
            <Paper
                elevation={3}
                sx={{
                    p: 6,
                    flex: '1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    order: { xs: 2, lg: 3 }
                }}
            >
                <InsertChartIcon sx={iconsStyles} />
                {
                    orderedSum ?
                        <Stack sx={{ gap: 1, justifyContent: 'space-between', width: '100%', flexDirection: 'row', textAlign: 'center' }}>
                            <Stack>
                                <Typography fontSize={'1.5rem'} fontWeight={600} whiteSpace={'nowrap'}>
                                    {`${orderedSum.toLocaleString('ru-RU')} ₽`}
                                </Typography>
                                <Typography>сумма заказов</Typography>
                            </Stack>
                            <Stack>
                                <Typography fontSize={'1.5rem'} fontWeight={600} whiteSpace={'nowrap'}>
                                    {`${purchasedSum.toLocaleString('ru-RU')} ₽`}
                                </Typography>
                                <Typography>сумма выкупа</Typography>
                            </Stack>
                        </Stack>
                        :
                        <Typography>Нет данных о сумме заказов</Typography>
                }
            </Paper>
            <Stack direction={'row'} gap={2} flexBasis={'100%'} flexWrap={'wrap'} sx={{ order: 4 }}>
                <Paper elevation={3} sx={{ p: 4, flex: '1' }}>
                    <Link href={'/cart'} className='woUnderline' sx={cardLinkStyles}>
                        <Typography variant='h2'>Корзина</Typography>
                        <Stack gap={2} alignItems={'center'} width='100%' flexWrap={'wrap'}>
                            {cartProducts.length ?
                                <AvatarGroup {...getAvatarGroupProps(56, 7)}>
                                    {cartProducts.map((item, i) => <Avatar
                                        key={item?.id || i + 'cart'}
                                        {...getAvatarProps(56, item?.product?._id, item?.product?.name)} />
                                    )}
                                </AvatarGroup>
                                :
                                <Typography>Нет товаров</Typography>}
                            <Link {...linkProps}>Моя корзина</Link>
                        </Stack>
                    </Link>
                </Paper>
                <Paper elevation={3} sx={{ p: 4, flex: '1' }}>
                    <Link href={'/favorits'} className='woUnderline' sx={cardLinkStyles}>
                        <Typography variant='h2'>Избранное</Typography>
                        <Stack gap={2} alignItems={'center'} width='100%' flexWrap={'wrap'}>
                            {favoritsProducts.length ?
                                <AvatarGroup {...getAvatarGroupProps(56, 7)}>
                                    {favoritsProducts.map((item, i) => <Avatar
                                        key={item?._id || i + 'cart'}
                                        {...getAvatarProps(56, item?._id, item?.name)} />
                                    )}
                                </AvatarGroup>
                                :
                                <Typography>Нет товаров</Typography>}
                            <Link {...linkProps}>Мое избранное</Link>
                        </Stack>
                    </Link>
                </Paper>
            </Stack>
        </>
    );
};

export default UserMain;
