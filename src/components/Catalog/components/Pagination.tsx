import React from 'react';
import { setFilter } from '../../../containers/Catalog/Catalog_container';
import { Pagination } from '@mui/material';

interface Props {
    onpage: number,
    page: number,
    qty: number | null,
    setFilter: setFilter,
}

const PaginationComp: React.FC<Props> = ({ onpage, page, qty, setFilter }) => {

    const pagesQty = qty ? Math.ceil(qty / onpage) : null;

    if (pagesQty && page > pagesQty) {
        setFilter({ p: "" + pagesQty })
    };

    return (
        pagesQty ? <Pagination count={pagesQty} page={page} onChange={(e, page) => setFilter({p: ""+page})} /> : null
    );
};

export default PaginationComp;
