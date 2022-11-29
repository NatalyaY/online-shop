import React from 'react';

import {
    Typography,
    Link,
    ListItem,
    MenuItem,
    Divider,
    Stack,
    MenuList,
    Button,
} from '@mui/material';
import { RouterChip } from '../../../common/components/styledComponents';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { type brands } from '../../../containers/Header/Header_container';
import { ResponsiveAccordion } from '../../../common/components/styledComponents';
import { useWindowWidth } from '../../../common/hooks/useWindowWidth';
import useCategories from './../../../common/hooks/useCategories';

interface IRPMenuLeft {
    selectedIndex: number,
    brandSelected: boolean,
    setBrandSelected: (val: boolean) => void,
    setSelectedIndex: (index: number) => void,
    categories: ReturnType<typeof useCategories>['topLevelCategories'],
    isMobile: boolean | undefined,
    handleClose: () => void,
    brands: brands
};

interface IRPMenuRight {
    selectedCategory: ReturnType<typeof useCategories>['topLevelCategories'][number],
    handleClose: () => void,
    brands: brands
};

interface IRPCategoriesList {
    categories: ReturnType<typeof useCategories>['topLevelCategories'],
    handleClose?: () => void,
    isTopLevel?: boolean,
    selectedIndex?: number,
    setBrandSelected?: (val: boolean) => void,
    setSelectedIndex?: (index: number) => void,
    isMobile?: boolean | undefined,
};

interface IRPBrands {
    handleClose: () => void,
    brands: brands
};

interface IRPCategoryLink {
    category: ReturnType<typeof useCategories>['topLevelCategories'][number],
    isMobile?: boolean | undefined,
    isTopLevel?: boolean,
    isSubcategory?: boolean | undefined,
    handleClose?: () => void,
};


const NavigationMenu: React.FC<{ handleClose: () => void, brands: brands }> = ({ handleClose, brands }) => {

    const [brandSelected, setBrandSelected] = React.useState(false);
    const variables = {
        up_md: {
            showRightMenu: true,
        },
        down_md: {
            showRightMenu: false,
        },
    };

    const values = useWindowWidth(variables);

    const { topLevelCategories, selectedIndex, setSelectedIndex, selectedCategory } = useCategories();

    return (
        <>
            <MenuLeft brands={brands} handleClose={handleClose} isMobile={!values.showRightMenu} selectedIndex={selectedIndex} brandSelected={brandSelected} setBrandSelected={setBrandSelected} setSelectedIndex={setSelectedIndex} categories={topLevelCategories} />
            {
                values.showRightMenu &&
                <>
                    <Divider orientation="vertical" flexItem />
                    <MenuRight selectedCategory={selectedCategory} handleClose={handleClose} brands={brands} />
                </>
            }
        </>
    );
};

const MenuLeft: React.FC<IRPMenuLeft> = ({ selectedIndex, brandSelected, setBrandSelected, setSelectedIndex, categories, isMobile, brands, handleClose }) => {
    return (
        <Stack spacing={0} direction="column" sx={{ flex: { xs: 1, md: 'unset' }, width: isMobile ? '100%' : 'unset' }} onClick={(e) => { isMobile && (e.target as HTMLElement).tagName !='A'&& e.stopPropagation() }}>
            <Typography variant='h4' sx={{ fontWeight: 600, color: 'primary.main' }}>Категории</Typography>
            <CategoriesList isMobile={isMobile} categories={categories} isTopLevel={true} selectedIndex={selectedIndex} setBrandSelected={setBrandSelected} setSelectedIndex={setSelectedIndex} />
            {
                isMobile ?
                    <ResponsiveAccordion title='Бренды' iconColor={'primary.main'} breakpoint={'md'} accordeonSX={{ width: '100%', mt: 2 }} accordionDetailsSX={{ p: 1, boxShadow: 1, borderRadius: 1 }} titleSX={{ p: 2, pl: 0, fontWeight: 600, color: 'primary.main', fontSize: '1.5rem', textTransform: 'none' }}>
                        <Brands brands={brands} handleClose={handleClose} />
                    </ResponsiveAccordion>
                    :
                    <Stack
                        spacing={2}
                        mt={2}
                        direction="row"
                        sx={{
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            backgroundColor: brandSelected ? 'primary.main' : null,
                            color: brandSelected ? 'primary.contrastText' : 'primary.main',
                            '&:hover': { backgroundColor: 'primary.dark' },
                            p: 2,
                            ml: -2
                        }}
                        onPointerEnter={() => { setSelectedIndex(-1); setBrandSelected(true) }}
                        component={Link} 
                        href={'/brands'}
                        className={'woUnderline'}
                    >
                        <Typography variant='h4' sx={{ fontWeight: 600 }}>Бренды</Typography>
                        <ChevronRightIcon sx={{ transform: { xs: 'rotate(90deg)', md: 'none' } }} />
                    </Stack>
            }
        </Stack>
    )
}

const MenuRight: React.FC<IRPMenuRight> = ({ selectedCategory, handleClose, brands }) => {
    return (
        <Stack spacing={2} direction="column" sx={{ ml: 7, alignItems: 'flex-start' }}>
            <Typography variant='h2' sx={{ mb: 3, color: 'primary.main' }}>{selectedCategory?.__text || 'Бренды:'}</Typography>
            {
                selectedCategory ?
                    selectedCategory.subcategories ?
                        <CategoriesList categories={selectedCategory.subcategories} handleClose={handleClose} />
                        : <Button variant="outlined" href={selectedCategory.breadcrumps![selectedCategory.breadcrumps!.length - 1].link}>К товарам</Button>
                    :
                    <Brands brands={brands} handleClose={handleClose} />
            }
        </Stack>
    )
}

const CategoriesList: React.FC<IRPCategoriesList> = ({ categories, handleClose, isTopLevel, selectedIndex, setBrandSelected, setSelectedIndex, isMobile }) => {
    return (
        <MenuList sx={isTopLevel ? { pl: isMobile ? 2 : 3 } : { display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {
                categories.map((category, index) =>
                    <MenuItem
                        key={category._id as unknown as string}
                        onClick={handleClose && !isMobile ? handleClose : undefined}
                        selected={selectedIndex != undefined && !isMobile ? index === selectedIndex : undefined}
                        onPointerEnter={(setSelectedIndex && setBrandSelected && !isMobile) ? () => { setSelectedIndex(index); setBrandSelected(false) } : undefined}
                        sx={{
                            flex: isTopLevel ? undefined : '0 1 30%',
                            order: isTopLevel ? undefined : category.subcategories ? 1 : 2,
                            p: 0,
                            pt: isMobile ? 2 : null,
                            flexDirection: isTopLevel ? undefined : 'column',
                            alignItems: isTopLevel ? undefined : 'flex-start',
                            display: isMobile ? 'box' : 'flex',
                            whiteSpace: isMobile ? 'normal' : 'nowrap',
                            '&:hover': { backgroundColor: 'transparent' },
                            '&.Mui-selected': isTopLevel ? { backgroundColor: 'primary.main', color: 'primary.contrastText' } : undefined,
                            '&.Mui-selected:hover': isTopLevel ? { backgroundColor: 'primary.dark' } : undefined,
                        }}>
                        {
                            isMobile && category.subcategories ?
                                    <ResponsiveAccordion title={category.__text} iconColor={'text.primary'} titleSX={{ color: 'inherit', fontWeight: 600, fontSize: '12px', }} breakpoint={'md'} accordeonSX={{ width: '100%', boxShadow: 1, p: 1, borderRadius: 1 }}>
                                                <>
                                                    <Button
                                                        variant={'outlined'}
                                                        href={category.breadcrumps![category.breadcrumps!.length - 1].link}
                                                        sx={{
                                                            fontWeight: 600,
                                                            '&:hover': { opacity: 1 },
                                                            fontSize: 'inherit',
                                                            textTransform: 'none',
                                                            display: 'flex',
                                                            ml: 1
                                                        }}
                                                    >
                                                        Все товары
                                                    </Button>
                                                    <CategoriesList isMobile={isMobile} categories={category.subcategories} isTopLevel={true} selectedIndex={selectedIndex} setBrandSelected={setBrandSelected} setSelectedIndex={setSelectedIndex} />
                                                </>
                                    </ResponsiveAccordion>
                                :
                                <>
                                    <CategoryLink category={category} isMobile={isMobile} isTopLevel={isTopLevel} handleClose={handleClose} />
                                    {
                                        category.subcategories && !isTopLevel ?
                                            <MenuList>
                                                {category.subcategories.map(category =>
                                                    <ListItem
                                                        key={category._id as unknown as string}
                                                        sx={{
                                                            p: 0,
                                                        }}>
                                                        <CategoryLink category={category} isMobile={isMobile} isTopLevel={isTopLevel} isSubcategory={true} handleClose={handleClose} />
                                                    </ListItem>
                                                )}
                                            </MenuList>
                                            : null
                                    }
                                </>
                        }
                    </MenuItem>
                )
            }
        </MenuList >
    )
}

const Brands: React.FC<IRPBrands> = ({ handleClose, brands }) => {
    return (
        <MenuList sx={{ display: 'flex', gap: { xs: 1, md: 3 }, flexWrap: 'wrap' }}>
            {
                brands.map(brand =>
                    <MenuItem
                        key={brand.text}
                        onClick={handleClose}
                        sx={{
                            p: 0,
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                        }}>
                        <RouterChip
                            label={brand.text}
                            href={brand.breadcrumps![brand.breadcrumps!.length - 1].link}
                            sx={{ fontSize: { xs: '10px', md: '12px' } }}
                        />
                    </MenuItem>
                )
            }
        </MenuList>
    )
};

const CategoryLink: React.FC<IRPCategoryLink> = ({ category, isMobile, isTopLevel, isSubcategory, handleClose }) => {
    return (
        <Link
            href={category.breadcrumps![category.breadcrumps!.length - 1].link}
            sx={{
                fontWeight: isSubcategory ? 400 : 600,
                fontSize: isTopLevel ? (isMobile ? '12px' : null) : (isSubcategory ? null : '18px'),
                wordBreak: isMobile ? 'break-all' : null,
                flex: isTopLevel ? 1 : null,
                p: isTopLevel ? 1 : '3px',
                pl: isTopLevel ? null : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: isTopLevel ? 2 : 1,
                '&:hover': isTopLevel ? { opacity: 1 } : null,
            }}
            onClick={handleClose}
            className={isTopLevel ? 'woUnderline' : ''}
        >
            {category.__text}
            {isTopLevel && <ChevronRightIcon />}
        </Link>
    )
};

export default NavigationMenu;