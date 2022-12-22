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
import { RouterChip, ResponsiveAccordion } from '../../../common/components/styledComponents';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { type brands } from '../../../containers/Header/Header_container';
import useCategories from './../../../common/hooks/useCategories';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CategoryInState } from '../../../../server/helpers';

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
    isMobile?: boolean,
};

interface IRPBrands {
    handleClose: () => void,
    brands: brands
};

interface IRPCategoryLink {
    category: ReturnType<typeof useCategories>['topLevelCategories'][number],
    isMobile?: boolean,
    isTopLevel?: boolean,
    isSubcategory?: boolean,
    handleClose?: () => void,
};


const NavigationMenu: React.FC<{ handleClose: () => void, brands: brands }> = ({ handleClose, brands }) => {

    const theme = useTheme();
    const [brandSelected, setBrandSelected] = React.useState(false);
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const { topLevelCategories, selectedIndex, setSelectedIndex, selectedCategory } = useCategories();

    return (
        <>
            <MenuLeft brands={brands} handleClose={handleClose} isMobile={!isDesktop} selectedIndex={selectedIndex} brandSelected={brandSelected} setBrandSelected={setBrandSelected} setSelectedIndex={setSelectedIndex} categories={topLevelCategories} />
            {
                isDesktop &&
                <>
                    <Divider orientation="vertical" flexItem />
                    <MenuRight selectedCategory={selectedCategory} handleClose={handleClose} brands={brands} />
                </>
            }
        </>
    );
};

const MenuLeft: React.FC<IRPMenuLeft> =
    ({
        selectedIndex,
        brandSelected,
        setBrandSelected,
        setSelectedIndex,
        categories,
        isMobile,
        brands,
        handleClose
    }) => {

        function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
            isMobile && (e.target as HTMLElement).tagName != 'A' && e.stopPropagation();
        };

        function handlePointerEnter() {
            setSelectedIndex(-1);
            setBrandSelected(true);
        };

        const styles = {
            flex: { xs: 1, md: 'unset' },
            width: isMobile ? '100%' : 'unset'
        };

        const brandsMobileProps = {
            title: 'Бренды',
            iconColor: 'primary.main',
            breakpoint: 'md' as 'md',
            accordeonSX: { width: '100%', mt: 2 },
            accordionDetailsSX: { p: 1, boxShadow: 1, borderRadius: 1 },
            titleSX: {
                p: 2,
                pl: 0,
                fontWeight: 600,
                color: 'primary.main',
                fontSize: '1.5rem',
                textTransform: 'none'
            }
        };

        const brandsDesktopProps = {
            spacing: 2,
            mt: 2,
            direction: "row" as "row",
            sx: {
                justifyContent: 'space-between',
                cursor: 'pointer',
                backgroundColor: brandSelected ? 'primary.main' : null,
                color: brandSelected ? 'primary.contrastText' : 'primary.main',
                '&:hover': { backgroundColor: 'primary.dark' },
                p: 2,
                ml: -2
            },
            onPointerEnter: handlePointerEnter,
            component: Link,
            href: '/brands',
            className: 'woUnderline'
        };

        return (
            <Stack spacing={0} direction="column" onClick={handleClick} sx={styles}>
                <Typography variant='h4' sx={{ fontWeight: 600, color: 'primary.main' }}>Категории</Typography>
                <CategoriesList isTopLevel={true} {...{ isMobile, categories, selectedIndex, setBrandSelected, setSelectedIndex }} />
                {
                    isMobile ?
                        <ResponsiveAccordion {...brandsMobileProps}>
                            <Brands brands={brands} handleClose={handleClose} />
                        </ResponsiveAccordion>
                        :
                        <Stack {...brandsDesktopProps}>
                            <Typography variant='h4' sx={{ fontWeight: 600 }}>Бренды</Typography>
                            <ChevronRightIcon sx={{ transform: { xs: 'rotate(90deg)', md: 'none' } }} />
                        </Stack>
                }
            </Stack>
        )
    };

const MenuRight: React.FC<IRPMenuRight> = ({ selectedCategory, handleClose, brands }) => {

    /* Retuns categories or brands */
    const getContent = () => {
        if (selectedCategory) {
            return (
                selectedCategory.subcategories ?
                    <CategoriesList categories={selectedCategory.subcategories} handleClose={handleClose} />
                    :
                    <Button variant="outlined" href={selectedCategory.breadcrumps[selectedCategory.breadcrumps.length - 1].link}>
                        К товарам
                    </Button>
            )
        } else {
            return <Brands brands={brands} handleClose={handleClose} />
        };
    };

    return (
        <Stack spacing={2} direction="column" sx={{ ml: 7, alignItems: 'flex-start' }}>
            <Typography variant='h2' sx={{ mb: 3, color: 'primary.main' }}>{selectedCategory?.__text || 'Бренды:'}</Typography>
            {
                getContent()
            }
        </Stack>
    )
};

type CategoryWithSubcategories = Omit<CategoryInState, 'subcategories'> & { subcategories: NonNullable<CategoryInState['subcategories']> };

const CategoriesList: React.FC<IRPCategoriesList> =
    ({
        categories,
        handleClose,
        isTopLevel,
        selectedIndex,
        setBrandSelected,
        setSelectedIndex,
        isMobile
    }) => {

        const menuItemStyles = (hasSubcategories: boolean) => {
            return {
                p: 0,
                pt: isMobile ? 2 : null,
                display: isMobile ? 'box' : 'flex',
                whiteSpace: isMobile ? 'normal' : 'nowrap',
                '&:hover': { backgroundColor: 'transparent' },
                ...(
                    !isTopLevel ?
                        {
                            flex: '0 1 30%',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            order: hasSubcategories ? 1 : 2,
                        }
                        : {
                            '&.Mui-selected': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
                            '&.Mui-selected:hover': { backgroundColor: 'primary.dark' },
                        }
                )
            }
        };

        const getMobileSubcategories = (category: CategoryWithSubcategories) => {

            const accordionProps = {
                title: category.__text,
                iconColor: 'text.primary',
                titleSX: { color: 'inherit', fontWeight: 600, fontSize: '12px' },
                breakpoint: 'md' as 'md',
                accordeonSX: { width: '100%', boxShadow: 1, p: 1, borderRadius: 1 }
            };

            const buttonProps = {
                variant: 'outlined' as 'outlined',
                href: category.breadcrumps[category.breadcrumps.length - 1].link,
                sx: {
                    fontWeight: 600,
                    '&:hover': { opacity: 1 },
                    fontSize: 'inherit',
                    textTransform: 'none',
                    display: 'flex',
                    ml: 1
                }
            };

            const categoriesListProps = {
                isMobile,
                selectedIndex,
                setBrandSelected,
                setSelectedIndex,
                categories: category.subcategories,
                isTopLevel: true
            };

            return (
                <ResponsiveAccordion {...accordionProps}>
                    <>
                        <Button {...buttonProps}>Все товары</Button>
                        <CategoriesList {...categoriesListProps} />
                    </>
                </ResponsiveAccordion>
            )
        };

        function handlePointerEnter(index: number) {
            return () => {
                setSelectedIndex!(index);
                setBrandSelected!(false);
            }
        };

        return (
            <MenuList sx={isTopLevel ? { pl: isMobile ? 2 : 3 } : { display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {
                    categories.map((category, index) =>
                        <MenuItem
                            key={category._id as unknown as string}
                            onClick={handleClose && !isMobile ? handleClose : undefined}
                            onPointerEnter={setSelectedIndex && setBrandSelected && !isMobile ? handlePointerEnter(index) : undefined}
                            selected={selectedIndex != undefined && !isMobile ? index === selectedIndex : undefined}
                            sx={menuItemStyles(Boolean(category.subcategories))}>
                            {
                                isMobile && category.subcategories ?
                                    getMobileSubcategories(category as CategoryWithSubcategories)
                                    :
                                    <>
                                        <CategoryLink category={category} isMobile={isMobile} isTopLevel={isTopLevel} handleClose={handleClose} />
                                        {
                                            category.subcategories && !isTopLevel ?
                                                <MenuList>
                                                    {
                                                        category.subcategories.map(category =>
                                                            <ListItem key={category._id as unknown as string} sx={{ p: 0, }}>
                                                                <CategoryLink {...{ category, isMobile, isTopLevel, handleClose }} isSubcategory={true} />
                                                            </ListItem>
                                                        )
                                                    }
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
    };

const Brands: React.FC<IRPBrands> = ({ handleClose, brands }) => {
    return (
        <MenuList sx={{ display: 'flex', gap: { xs: 1, md: 3 }, flexWrap: 'wrap' }}>
            {
                brands.map(brand =>
                    <MenuItem
                        key={brand.text}
                        onClick={handleClose}
                        sx={{ p: 0, '&:hover': { backgroundColor: 'transparent' } }}>
                        <RouterChip
                            label={brand.text}
                            href={brand.breadcrumps[brand.breadcrumps.length - 1].link}
                            sx={{ fontSize: { xs: '10px', md: '12px' } }}
                        />
                    </MenuItem>
                )
            }
        </MenuList>
    )
};

const CategoryLink: React.FC<IRPCategoryLink> = ({ category, isMobile, isTopLevel, isSubcategory, handleClose }) => {

    const linkProps = {
        href: category.breadcrumps[category.breadcrumps.length - 1].link,
        sx: {
            fontWeight: isSubcategory ? 400 : 600,
            wordBreak: isMobile ? 'break-all' : null,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...(
                isTopLevel ?
                    {
                        flex: 1,
                        p: 1,
                        gap: 2,
                        '&:hover': { opacity: 1 },
                        fontSize: isMobile ? '12px' : null
                    }
                    : {
                        p: '3px',
                        pl: 0,
                        gap: 1,
                        fontSize: isSubcategory ? null : '18px'
                    }
            )
        },
        onClick: handleClose,
        className: isTopLevel ? 'woUnderline' : ''
    };

    return (
        <Link {...linkProps}>
            {category.__text}
            {isTopLevel && <ChevronRightIcon />}
        </Link>
    )
};

export default NavigationMenu;