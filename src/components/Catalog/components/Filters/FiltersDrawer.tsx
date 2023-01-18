import React from 'react'
import { BrandInState, CategoryInState } from "../../../../../server/helpers";
import { clearFilter, price, setFilter, filter } from "../../../../containers/Catalog/Catalog_container";
import {
    Drawer,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Filters from './Filters';
import { filtersState } from '../../../../common/types';

interface FiltersDrawerProps {
    variant?: 'permanent' | 'temporary',
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean,
    filter: filter,
    brand?: BrandInState,
    category?: CategoryInState,
    price?: price,
    setFilter: setFilter,
    clearFilter: clearFilter,
    searchParams: filtersState
}

const FiltersDrawer: React.FC<FiltersDrawerProps> = ({ variant, setOpen, open, ...rest }) => {

    const isOpen = variant == 'permanent' ? true : open;
    const handleClose = variant == 'permanent' ? () => { } : () => setOpen(!open);
    const styles = {
        width: variant == 'permanent' ? '250px' : '400px',
        maxWidth: '100%',
        zIndex: '1600',
        '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            position: 'relative',
            width: '100%'
        }
    };

    return (
        <Drawer
            variant={variant}
            open={isOpen}
            onClose={handleClose}
            sx={styles}
            PaperProps={{ sx: { p: 2 } }}
        >
            <>
                {
                    variant != 'permanent' &&
                    <CloseIcon onClick={() => setOpen(!open)} sx={{ marginLeft: 'auto' }} aria-label="Закрыть" />
                }
                <Filters {...rest} />
            </>
        </Drawer>
    );
};

export default FiltersDrawer;