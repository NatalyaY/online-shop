import React from 'react';
import { Typography, Stack, Paper, Divider, List, ListItem } from '@mui/material';
import { products, cartStatus } from '../../../../containers/Cart/Cart_container';
import Summary from '../Summary';
import ProductInCart from './ProductInCart';

interface ICartListProps {
    productsWithQty: Exclude<products, []>;
    setProductsToOrder: React.Dispatch<React.SetStateAction<Exclude<products, []>>>;
    setStage: React.Dispatch<React.SetStateAction<2 | 1 | 3>>;
    cartStatus: cartStatus;
};

const CartList: React.FC<ICartListProps> = ({ productsWithQty, setProductsToOrder, setStage, cartStatus }) => {

    const emptyProducts = productsWithQty.filter(p => p.product == undefined).length !== 0;



    const [tempProductsWithQty, setTempProductsWithQty] = React.useState(productsWithQty);

    const productsQty = productsWithQty.length ? [...productsWithQty].reduce((total, cur) => total + cur.qty, 0) : 0;
    const productsTempQty = tempProductsWithQty.reduce((total, cur) => total + cur.qty, 0);

    let isSummaryBtnDisabled = emptyProducts || cartStatus.status == 'loading' || productsQty !== productsTempQty;

    function handleSummaryBtnClick() {
        setProductsToOrder(productsWithQty);
        setStage(2);
    };

    function setProductTempQty(productWithQty: products[number]) {
        const index = tempProductsWithQty.findIndex(p => p.id == productWithQty.id);
        const newState = [...tempProductsWithQty];
        if (index == -1) return;
        newState[index] = { ...newState[index], ...productWithQty };
        setTempProductsWithQty(newState);
    };

    const updateFromServer = (productsWithQty: products) => {
        let newTempProductsWithQty = [...tempProductsWithQty];
        newTempProductsWithQty = newTempProductsWithQty.filter(p => productsWithQty.findIndex(pr => pr.id == p.id) !== -1);

        productsWithQty.forEach(p => {
            const index = newTempProductsWithQty.findIndex(prod => prod.id == p.id);
            const isQtyChanged = (p.product?._id == cartStatus.lastId) && (cartStatus.status == 'succeeded' || cartStatus.status == 'failed');

            if (index == -1) {
                newTempProductsWithQty.push(p);
            } else if (newTempProductsWithQty[index].product == undefined && p.product) {
                newTempProductsWithQty[index] = { ...newTempProductsWithQty[index], product: p.product };
            }

            if (isQtyChanged) {
                newTempProductsWithQty[index] = { ...newTempProductsWithQty[index], qty: p.qty };
            };
        });
        setTempProductsWithQty(newTempProductsWithQty);
    };

    React.useEffect(() => {
        updateFromServer(productsWithQty);
    }, [productsWithQty]);

    return (
        <>
            <Typography variant="h1" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                Корзина
                <Typography component={'span'} sx={{ color: 'secondary.light', fontSize: '1.2rem' }}>{productsWithQty.length}</Typography>
            </Typography>
            <Stack direction={'row'} gap={4} flexWrap={{ xs: 'wrap', lg: 'nowrap' }} alignItems={'flex-start'}>
                <Paper sx={{ p: 4, flex: '3 1 400px' }}>
                    <List sx={{ display: 'flex', gap: 2, flexDirection: 'column', p: 0 }}>
                        {productsWithQty.map((p, i) => <React.Fragment key={p.product?._id || i}>
                            <ListItem sx={{ whiteSpace: 'normal', p: 0 }}>
                                <ProductInCart productWithQty={p} setProductTempQty={setProductTempQty} />
                            </ListItem>
                            {i != productsWithQty.length - 1 &&
                                <Divider />}
                        </React.Fragment>
                        )}
                    </List>
                </Paper>
                <Paper sx={{ p: 4, flex: '1 1 350px', position: 'sticky', top: document.querySelector('header')?.clientHeight || 0 }}>
                    <Summary
                        {...{
                            products: tempProductsWithQty,
                            stage: 1,
                            handleSummaryBtnClick,
                            isDisabled: isSummaryBtnDisabled,
                            isLoading: false
                        }} />
                </Paper>
            </Stack>
        </>
    );
};

export default CartList;

