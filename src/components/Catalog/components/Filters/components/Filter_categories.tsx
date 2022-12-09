import React from 'react';
import {
    MenuList,
    Link,
    ListItem
} from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { BrandInState, CategoryInState } from '../../../../../../server/helpers';
import { filtersState } from '../../../../../common/types';

interface CategoriesProps {
    categories: CategoryInState[],
    category?: CategoryInState,
    brand?: BrandInState,
    pl?: number,
    searchParams: filtersState,
    backBtn?: boolean
};

const Filter_categories: React.FC<CategoriesProps> = ({ categories, category, brand, pl, searchParams, backBtn }) => {

    let brandLink: string;

    if (brand) {
        brandLink = brand.breadcrumps[brand.breadcrumps.length - 1].link;
    };

    let querystring: string = '';

    if (searchParams.s) {
        const { p, onpage, sorting, category: c, ...query } = searchParams;
        const params = new URLSearchParams();
        Object.entries(query).forEach(entry => params.append(entry[0], entry[1]));
        querystring = `?${params.toString()}`;
    };

    const LinkStyles = (cat: CategoryInState) => {
        return {
            ml: cat.UUID == category?.UUID ? 0 : 2,
            mb: cat.UUID == category?.UUID ? 0 : 1,
            p: cat.UUID == category?.UUID ? 1 : 0,
            ...((cat.UUID != category?.UUID && cat._parentId != category?.UUID) ? { m: 0 } : {}),
            backgroundColor: cat.UUID == category?.UUID ? '#029fae2e' : 'transparent',
            borderRadius: cat.UUID == category?.UUID ? 1 : 0,
            fontWeight: cat.UUID == category?.UUID ? 600 : '',
            display: 'flex',
            gap: 1 / 2,
            alignItems: 'center',
        }
    };

    return (
        <MenuList sx={{ pl: pl, py: 0 }}>
            {
                backBtn &&
                <ListItem sx={{ alignItems: 'flex-start', flexDirection: 'column', p: 0 }}>
                    <Link href={'/search' + querystring} className='woUnderline' sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowBackIosRoundedIcon fontSize='inherit' />
                        Все категории
                    </Link>
                    <Filter_categories categories={categories} category={category} pl={2} brand={brand} searchParams={searchParams} />
                </ListItem>
                ||
                categories.map((cat, i) => {
                    const catLink = cat.breadcrumps[cat.breadcrumps.length - 1].link.slice(0);
                    const href = brandLink ? catLink.replace('/categories', brandLink) + querystring : catLink + querystring;
                    return (
                        <ListItem sx={{ alignItems: 'flex-start', flexDirection: 'column', p: 0, pt: 1 }} key={cat.UUID}>
                            <Link
                                href={href}
                                className='woUnderline'
                                sx={{ ...LinkStyles(cat), ...((i == categories.length - 1 && cat._parentId == category?.UUID) ? { mb: 0 } : {}) }}
                            >
                                {
                                    cat.UUID != category?.UUID && cat._parentId != category?.UUID &&
                                    <ArrowBackIosRoundedIcon fontSize='inherit' />
                                }
                                {cat.__text}
                            </Link>

                            {
                                cat.subcategories && cat._parentId != category?.UUID && <Filter_categories categories={cat.subcategories} category={category} pl={2} brand={brand} searchParams={searchParams} />
                            }
                        </ListItem>
                    )
                })
            }
        </MenuList>
    )
};

export default Filter_categories;