import React from 'react';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';

const AddToFavorits: React.FC<{ isAddedToFavorites: boolean, handleAddToFavorites: (e: React.MouseEvent<Element, MouseEvent>) => void }> = ({ isAddedToFavorites, handleAddToFavorites }) => {

    const FavoritsCommonStyles = {
        cursor: 'pointer',
        borderRadius: '8px',
        fontSize: '32px',
        display: 'block',
        ml: 'auto'
    };

    const FavoritsStyles = {
        color: 'text.primary',
        '&:hover': {
            color: '#dc416d',
        },
    };

    const FavoritsActiveStyles = {
        color: '#dc416d',
        '&:hover': {
            color: '#d76c8b',
        },
    };

    return (
        isAddedToFavorites ?
            <FavoriteRoundedIcon onClick={handleAddToFavorites} sx={{ ...FavoritsCommonStyles, ...FavoritsActiveStyles, zIndex: 2 }} />
            :
            <FavoriteBorderRoundedIcon onClick={handleAddToFavorites} sx={{ ...FavoritsCommonStyles, ...FavoritsStyles, zIndex: 2 }} />
    )
};

export default AddToFavorits;