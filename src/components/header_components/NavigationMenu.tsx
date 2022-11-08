import React from 'react';
import { useSelector } from 'react-redux';

import { selectBrands } from '../../features/brands/brandsSlice';

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
import { RouterChip } from '../../common/styledComponents';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import useCategories, { type categoryWithSub } from '../../common/hooks/useCategories';

interface IRPMenuLeft {
    selectedIndex: number,
    brandSelected: boolean,
    setBrandSelected: (val: boolean) => void,
    setSelectedIndex: (index: number) => void,
    categories: categoryWithSub[]
};

interface IRPMenuRight {
    allCategories: categoryWithSub[],
    selectedCategory: categoryWithSub,
    handleClose: () => void,
    brands: ReturnType<typeof selectBrands>
};

interface IRPCategoriesList {
    categories: categoryWithSub[],
    handleClose?: () => void,
    isTopLevel?: boolean,
    selectedIndex?: number,
    setBrandSelected?: (val: boolean) => void,
    setSelectedIndex?: (index: number) => void,
};


const NavigationMenu: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {

    const [brandSelected, setBrandSelected] = React.useState(false);
    const brands = useSelector(selectBrands);

    const { categoriesTree, topLevelCategories, selectedIndex, setSelectedIndex, selectedCategory } = useCategories();

    return (
        <>
            <MenuLeft selectedIndex={selectedIndex} brandSelected={brandSelected} setBrandSelected={setBrandSelected} setSelectedIndex={setSelectedIndex} categories={topLevelCategories} />
            <Divider orientation="vertical" flexItem />
            <MenuRight allCategories={categoriesTree} selectedCategory={selectedCategory} handleClose={handleClose} brands={brands} />
        </>
    );
};

const MenuLeft: React.FC<IRPMenuLeft> = ({ selectedIndex, brandSelected, setBrandSelected, setSelectedIndex, categories }) => {
    return (
        <Stack spacing={0} direction="column">
            <Typography variant='h4' sx={{ fontWeight: 600, color: 'primary.main' }}>Категории</Typography>
            <CategoriesList categories={categories} isTopLevel={true} selectedIndex={selectedIndex} setBrandSelected={setBrandSelected} setSelectedIndex={setSelectedIndex} />
            <Stack spacing={2} mt={2} direction="row"
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
            >
                <Typography variant='h4' sx={{ fontWeight: 600 }}>Бренды</Typography>
                <ChevronRightIcon />
            </Stack>
        </Stack>
    )
}

const MenuRight: React.FC<IRPMenuRight> = ({ allCategories, selectedCategory, handleClose, brands }) => {
    return (
        <Stack spacing={2} direction="column" sx={{ ml: 7, alignItems: 'flex-start' }}>
            <Typography variant='h2' sx={{ mb: 3, color: 'primary.main' }}>{selectedCategory?.__text || 'Бренды:'}</Typography>
            {
                selectedCategory ?
                    selectedCategory.subcategories ?
                        <CategoriesList categories={selectedCategory.subcategories} handleClose={handleClose} />
                        : <Button variant="outlined" href={selectedCategory.breadcrumps![selectedCategory.breadcrumps!.length - 1].link}>К товарам</Button>
                    :
                    <MenuList sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {
                            brands.map(brand =>
                                <MenuItem
                                    key={brand.text}
                                    onClick={handleClose}
                                    sx={{
                                        p: 0,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        }
                                    }}>
                                    <RouterChip
                                        label={brand.text}
                                        href={brand.breadcrumps![brand.breadcrumps!.length - 1].link}
                                    />
                                </MenuItem>
                            )

                        }
                    </MenuList>
            }
        </Stack>
    )
}

const CategoriesList: React.FC<IRPCategoriesList> = ({ categories, handleClose, isTopLevel, selectedIndex, setBrandSelected, setSelectedIndex }) => {
    return (
        <MenuList sx={isTopLevel ? { pl: 3 } : { display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {
                categories.map((category, index) =>
                    <MenuItem
                        key={category._id as unknown as string}
                        onClick={handleClose ? handleClose : undefined}
                        selected={selectedIndex != undefined ? index === selectedIndex : undefined}
                        onPointerEnter={(setSelectedIndex && setBrandSelected) ? () => { setSelectedIndex(index); setBrandSelected(false) } : undefined}
                        sx={{
                            flex: isTopLevel ? undefined : '0 1 30%',
                            order: isTopLevel ? undefined : category.subcategories ? 1 : 2,
                            p: 0,
                            flexDirection: isTopLevel ? undefined : 'column',
                            alignItems: isTopLevel ? undefined : 'flex-start',
                            '&:hover': { backgroundColor: 'transparent' },
                            '&.Mui-selected': isTopLevel ? { backgroundColor: 'primary.main', color: 'primary.contrastText' } : undefined,
                            '&.Mui-selected:hover': isTopLevel ? { backgroundColor: 'primary.dark' } : undefined,
                        }}>
                        <Link
                            href={category.breadcrumps![category.breadcrumps!.length - 1].link}
                            sx={{
                                fontWeight: 600,
                                fontSize: isTopLevel ? null : '18px',
                                flex: isTopLevel ? 1 : null,
                                p: isTopLevel ? 1 : null,
                                display: isTopLevel ? 'flex' : null,
                                justifyContent: isTopLevel ? 'space-between' : null,
                                gap: isTopLevel ? 2 : null,
                                '&:hover': isTopLevel ? { opacity: 1 } : null,
                            }}
                            role={isTopLevel ? 'directory' : 'link'}
                        >
                            {category.__text}
                            {isTopLevel && <ChevronRightIcon />}
                        </Link>
                        {
                            category.subcategories && !isTopLevel ?
                                <MenuList>
                                    {category.subcategories.map(category =>
                                        <ListItem
                                            key={category._id as unknown as string}
                                            sx={{
                                                p: 0,
                                            }}>
                                            <Link
                                                href={category.breadcrumps![category.breadcrumps!.length - 1].link}
                                                sx={{
                                                    p: '3px',
                                                    pl: 0,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    gap: 1,
                                                }}
                                            >
                                                {category.__text}
                                            </Link>

                                        </ListItem>
                                    )}
                                </MenuList>
                                : null
                        }
                    </MenuItem>
                )
            }
        </MenuList>
    )
}

export default NavigationMenu;