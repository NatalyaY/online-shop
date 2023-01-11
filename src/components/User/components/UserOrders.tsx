import { Card, CardContent, CardHeader, Typography, Stack, Chip, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import React from 'react';
import { ordersState } from '../../../common/types';
import { ordersProducts } from '../../../containers/User/User_container';
import ProductInCartTYP from '../../Cart/components/Stage3/ProductInCartTYP';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import getCorrectTextEndings from './../../../common/helpers/getCorrectTextEndings';

const UserOrders: React.FC<{ orders: ordersState, ordersProducts: ordersProducts }> = ({ orders, ordersProducts }) => {

    const userOrders = orders.orders ?
        [...orders.orders].sort((a, b) => b.creationDate - a.creationDate)
        : null;

    const dateOptions = {
        dateStyle: "long" as 'long',
    };

    const statusColors = {
        'В сборке': '#dddd97',
        'В пути': 'primary.light',
        'Ожидает получения': 'warning.main',
        'Получен': 'info.main'
    };

    const headerStyles = {
        '& .MuiCardHeader-content': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
        },
        backgroundColor: 'secondary.main',
    };

    const getOrderTitle = (order: NonNullable<ordersState['orders']>[number]) => {
        return (
            <Stack>
                <Typography variant='h2'>
                    {'Заказ №' + order.UUID}
                </Typography>
                <Typography variant='h6'>
                    {new Date(order.creationDate).toLocaleDateString('ru', dateOptions)}
                </Typography>
            </Stack>

        )
    };

    const getOrderSubTitle = (order: NonNullable<ordersState['orders']>[number]) => {
        const bgColor = order.status !== 'Новый' ? statusColors[order.status] : '';
        const color = order.status !== 'Новый' ? 'white' : '';
        return (
            <Stack>
                <Typography variant='h2' whiteSpace={'nowrap'}>
                    {`${order.totalSalePrice.toLocaleString('ru-RU')} ₽`}
                </Typography>
                <Chip sx={{ backgroundColor: bgColor, color: color }} variant='filled' label={order.status} />
            </Stack>

        )
    };

    const contentStyles = {
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(auto-fill, minmax(220px, 1fr))', sm: 'repeat(auto-fill, minmax(300px, 1fr))' },
        gap: 1
    };

    return (
        <>
        <Typography variant='h1' width={'100%'}>Мои заказы</Typography>
            {
                userOrders && userOrders.map(order =>
                    <Card sx={{ width: '100%' }} key={order._id}>
                        <CardHeader
                            disableTypography={true}
                            title={getOrderTitle(order)}
                            subheader={getOrderSubTitle(order)}
                            sx={headerStyles}
                        ></CardHeader>
                        <CardContent>
                            <Accordion elevation={0}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        '& .MuiAccordionSummary-content': { flex: '0 0 auto' },
                                        justifyContent: 'flex-start',
                                        gap: 1,
                                        textDecoration: 'underline'
                                    }}>
                                    <Typography>
                                        {
                                            `${order.items.length} ${getCorrectTextEndings({
                                                qty: order.items.length,
                                                textsArr: ['товар', 'товара', 'товаров']
                                            })}`
                                        }
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={contentStyles}>
                                        {
                                            order.items.map(item => {
                                                const product = ordersProducts.find(o => o.id == item.id);
                                                return (
                                                    product &&
                                                    <ProductInCartTYP key={product.id + order._id} product={product} />
                                                )
                                            })
                                        }
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </CardContent>
                    </Card>
                )
                ||
                <Typography>Нет заказов</Typography>
            }
        </>
    )
};

export default UserOrders;