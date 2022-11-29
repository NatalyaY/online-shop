import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './../../app/redux-hooks';
import { addToCart, removeFromCart, selectCart } from '../../features/cart/cartSlice';
import { addToFavorite, removeFromFavorites, selectFavorits } from '../../features/favorits/favoritsSlice';


const useProductActions = (id : string) => {
    const [isAddedToCart, setIsAddedToCart] = React.useState<boolean>(false);
    const [isAddToCartClicked, setIsAddToCartClicked] = React.useState<boolean>(false);
    const [isAddedToFavorites, setIsAddedToFavorites] = React.useState<boolean>(false);
    const [isAddToFavoritesClicked, setIsAddToFavoritesClicked] = React.useState<boolean>(false);

    const dispatch = useAppDispatch();
    const favoriteActions = {
        add: (id: string) => dispatch(addToFavorite(id)),
        remove: (id: string) => dispatch(removeFromFavorites(id)),
    };

    const cartActions = {
        add: (id: string) => dispatch(addToCart(id)),
        remove: (id: string) => dispatch(removeFromCart(id)),
    };

    const favorits = useSelector(selectFavorits);
    const cart = useSelector(selectCart);

    React.useEffect(() => {
        const isInCart = cart.items?.includes(id) || false;
        const isInFavorites = favorits.items?.includes(id) || false;
        (isAddedToCart !== isInCart) && setIsAddedToCart(isInCart);
        (isAddedToFavorites !== isInFavorites) && setIsAddedToFavorites(isInFavorites);
    }, [])

    React.useEffect(() => {
        if (cart.lastUpdatedId != id && favorits.lastUpdatedId != id) return;
        const isAdded = (favorits.lastUpdatedId != id) ? cart.items?.includes(id) || false : favorits.items?.includes(id) || false;
        (favorits.lastUpdatedId != id) ? isAddedToCart !== isAdded && setIsAddedToCart(isAdded) : isAddedToFavorites !== isAdded && setIsAddedToFavorites(isAdded);
    }, [cart, favorits])

    React.useEffect(() => {
        if (!isAddToCartClicked && !isAddToFavoritesClicked) return;
        isAddToCartClicked && setIsAddToCartClicked(false);
        isAddToFavoritesClicked && setIsAddToFavoritesClicked(false);
        if (isAddToCartClicked) {
            isAddedToCart ? setTimeout(() => cartActions.add(id), 10) : setTimeout(() => cartActions.remove(id), 10);
        } else {
            isAddedToFavorites ? setTimeout(() => favoriteActions.add(id), 10) : setTimeout(() => favoriteActions.remove(id), 10);
        };
    }, [isAddedToCart, isAddToCartClicked, isAddedToFavorites, isAddToFavoritesClicked])

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAddedToCart(!isAddedToCart);
        setIsAddToCartClicked(true);
    };

    const handleAddToFavorites = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAddedToFavorites(!isAddedToFavorites);
        setIsAddToFavoritesClicked(true);
    };

    return { handleAddToCart, handleAddToFavorites, isAddedToCart, isAddedToFavorites }
};

export default useProductActions;