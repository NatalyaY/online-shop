import React from 'react';
import { ProductInState } from '../../../../server/helpers';
import ShoppingCartOutlinedIcon  from '@mui/icons-material/ShoppingCartOutlined';
import { Typography, Button } from '@mui/material';

const AddToCart: React.FC<{ product: ProductInState, isAddedToCart: boolean, handleAddToCart: (e: React.MouseEvent<Element, MouseEvent>) => void, onlyIcon?: boolean }> = ({ product, isAddedToCart, handleAddToCart, onlyIcon }) => {

    const AddToCartButtonStyles = {
        backgroundColor: 'primary.main',
        color: 'white',
        borderColor: 'primary.main',
        '&:hover': {
            backgroundColor: '#007580',
            borderColor: '#007580',
            boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)'
        },
    };

    const InCartButtonStyles = {
        backgroundColor: 'white',
        color: 'primary.main',
        borderColor: 'primary.main'
    };

    const text = isAddedToCart ? 'В корзинe' : 'В корзину';

    return (
        product.amount > 0 ?
            <Button
                onClick={handleAddToCart}
                variant={"outlined"}
                sx={{ py: 1, transition: 'none', minWidth: 'fit-content', ...(isAddedToCart ? InCartButtonStyles : AddToCartButtonStyles), flex: '1', gap: 1 }}
            >
                <ShoppingCartOutlinedIcon />
                {!onlyIcon && text}
            </Button>
            :
            <Typography variant='body1' sx={{ flex: '1' }}>Нет в наличии</Typography>
    )
};

export default AddToCart;