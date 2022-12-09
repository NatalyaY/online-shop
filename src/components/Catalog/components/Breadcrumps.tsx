import React from 'react';
import {
    Typography,
    Breadcrumbs,
    Link,
} from '@mui/material';
import { BrandInState, CategoryInState } from '../../../../server/helpers';

interface Props {
    category?: CategoryInState,
    brand?: BrandInState
}

const Breadcrumps: React.FC<Props> = ({ category, brand }) => {
    const categoryBreadcrumps = category ?
        category.breadcrumps.map(br => {
            const breadcrump = { ...br };
            const brandLink = brand ? brand.breadcrumps[brand.breadcrumps.length - 1].link : null;
            breadcrump.link = brandLink ? breadcrump.link.replace('/categories', brandLink) : breadcrump.link;
            return breadcrump;
        })
        : [];

    const breadcrumps = brand ? [...brand.breadcrumps, ...categoryBreadcrumps.slice(1)] : categoryBreadcrumps;
    return (
        <Breadcrumbs aria-label="breadcrumb">
            {
                breadcrumps.map((breadcrump, i) =>
                    i == breadcrumps.length - 1 ?
                        <Typography key={i}>{breadcrump.textRU}</Typography>
                        :
                        <Link key={i} href={breadcrump.link}>{breadcrump.textRU}</Link>
                )
            }
        </Breadcrumbs>
    );
};

export default Breadcrumps;
