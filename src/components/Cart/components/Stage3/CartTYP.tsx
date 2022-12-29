import React from 'react';
import { Typography, Stack } from '@mui/material';
import { products } from '../../../../containers/Cart/Cart_container';
import { NewOrder, ordersState } from '../../../../common/types';
import getCarousel, { MultipleCarousel } from '../../../../common/HOC/MultipleCarousel';
import CarouselHeader from '../../../Home/components/Carousel/CarouselHeader';
import { noResultsContainerStyles } from '../../../Catalog/Catalog';
import ProductInCartTYP from './ProductInCartTYP';
import CartTYPOrderDetails from './CartTYPOrderDetails';
import { reverse } from 'dns';
import { useDebouncedFunction } from './../../../../common/hooks/useWindowWidth';

interface ICartTYPProps {
    orders: ordersState;
    products: Exclude<products, []>;
};

export type orderedProduct = NewOrder['items'][number] & { product: Exclude<products, []>[number]['product'] }

const CartTYP: React.FC<ICartTYPProps> = ({ orders, products }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const currentOrder = orders.orders?.find(o => o.UUID == orders.lastUpdatedId);

    const [isNoBtns, setIsNoBtns] = React.useState(true);

    function getBtnsDisplayOption() {
        if (!ref.current) return;
        const carouselElement = [...ref.current.children].find(ch => ch.classList.contains('carousel'));
        const noBtns = carouselElement ? carouselElement.scrollWidth == carouselElement.clientWidth : true;
        if (noBtns !== isNoBtns) {
            setIsNoBtns(noBtns)
        };
    };

    const debouncedGetBtnsDisplayOption = useDebouncedFunction(getBtnsDisplayOption, 300);

    React.useEffect(() => {
        getBtnsDisplayOption();
    }, [ref.current]);

    React.useEffect(() => {
        if (!currentOrder) return;
        window.addEventListener('resize', debouncedGetBtnsDisplayOption);
        return () => {
            window.removeEventListener('resize', debouncedGetBtnsDisplayOption);
        };
    }, []);

    if (!currentOrder) {
        return (
            <>
                <Typography variant="h1" sx={{ zIndex: '1', color: 'primary.main' }}>
                    Упс! Что-то пошло не так...
                </Typography>
                <Typography sx={{ color: 'secondary.light', fontSize: '1.2rem' }}>
                    Попробуйте оформить заказ заново
                </Typography>
            </>
        );
    };

    const orderedProducts = currentOrder.items.map(p => {
        const product = products.find(pr => pr.id == p.id)?.product;
        return { ...p, product };
    });

    const time = 300;
    const delay = time + 3000;
    const settings = getCarousel({ time, delay, itemsQty: orderedProducts?.length || 0, infinite: false });

    const isBackDisabled = settings.index == 0;
    const isForwardDisabled = settings.index == orderedProducts.length - 1;



    return (
        <>
            <Stack sx={noResultsContainerStyles('/img/order-done.png')}>
                <Typography variant="h1" sx={{ zIndex: '1', color: 'primary.main' }}>
                    {`Заказ №${orders.lastUpdatedId} оформлен`}
                </Typography>
                <Typography sx={{ color: 'secondary.light', fontSize: '1.2rem', zIndex: '1' }}>
                    Ожидайте звонка с подтверждением
                </Typography>
            </Stack>
            <Stack sx={{ flex: '1', flexDirection: 'row', gap: 4, flexWrap: 'wrap-reverse' }}>
                <Stack flex={'1'} gap={2} flexBasis={'350px'} alignItems={'center'} width={'50%'} ref={ref}>
                    <CarouselHeader
                        text={'В заказе:'}
                        handleBack={settings.handleBack}
                        handleForward={settings.handleForward}
                        noButtons={isNoBtns}
                        backDisabled={isBackDisabled}
                        forwardDisabled={isForwardDisabled}
                        sx={{ mb: 0 }} />
                    {
                        orderedProducts &&
                        <MultipleCarousel settings={settings.carouselSettings} sx={{ width: '100%' }}>
                            {orderedProducts.map((product, i) =>
                                <ProductInCartTYP product={product} key={product.id} />
                            )}
                        </MultipleCarousel>
                    }
                </Stack>
                <CartTYPOrderDetails contacts={currentOrder.contacts} />
            </Stack>
        </>
    );
};

export default CartTYP;

