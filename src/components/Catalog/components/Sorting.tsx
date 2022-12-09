import React from 'react';
import {
    Stack,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { setFilter, sorting } from '../../../containers/Catalog/Catalog_container';

interface Props {
    isMobile: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean,
    onpage: number,
    setFilter: setFilter,
    sorting: sorting,
}

const Sorting: React.FC<Props> = ({ isMobile, setOpen, open, onpage, setFilter, sorting }) => {
    return (
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={2} sx={{ width: '100%' }}>
            {
                isMobile &&
                <IconButton aria-label="Отфильтровать" onClick={() => setOpen(!open)}>
                    <TuneIcon />
                </IconButton>
            }
            <Select
                value={onpage}
                onChange={(e) => setFilter({ onpage: "" + e.target.value })}
                variant={'outlined'}
                sx={{ '& .MuiSelect-select': { py: 1 }, order: isMobile ? 2 : 'unset' }}
            >
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={40}>40</MenuItem>
                <MenuItem value={100}>100</MenuItem>
            </Select>
            <Select
                value={sorting}
                onChange={(e) => setFilter({ sorting: e.target.value as sorting })}
                variant={isMobile ? 'standard' : 'outlined'}
                sx={{ '& .MuiSelect-select': { py: 1 } }}
            >
                <MenuItem value={'popular'}>Популярные</MenuItem>
                <MenuItem value={'new'}>Новинки</MenuItem>
                <MenuItem value={'price_asc'}>Сначала дешёвые</MenuItem>
                <MenuItem value={'price_desc'}>Сначала дорогие</MenuItem>
            </Select>
        </Stack>
    )
};

export default Sorting;