import React from 'react';
import { useSelector } from 'react-redux';
import { selectCategories } from '../../features/categories/categoriesSlice';

type cat = ReturnType<typeof selectCategories>[number];

type category = Omit<cat, "breadcrumps" | "productsQty"> & { breadcrumps?: cat['breadcrumps'], productsQty?: cat['productsQty'] };
export type categoryWithSub = category & {
    subcategories?: categoryWithSub[];
};

export const getSubcategories = (cat: category, categories: category[]) => {
    const subcategories = categories.filter(c => c._parentId == cat.UUID);
    if (!subcategories.length) {
        return cat;
    };
    const withSubcategory: categoryWithSub = { ...cat, subcategories: subcategories.map(cat => getSubcategories(cat, categories)) };
    return withSubcategory;
};

const useCategories = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const categories = useSelector(selectCategories);
    const categoriesCopy = JSON.parse(JSON.stringify(categories)) as typeof categories;
    const categoriesTree: categoryWithSub[] = categoriesCopy.map(cat => getSubcategories(cat, categories));

    const topLevelCategories = categoriesTree.filter(cat => !cat._parentId);

    const selectedCategory = topLevelCategories[selectedIndex];

    return { categoriesTree, topLevelCategories, selectedIndex, setSelectedIndex, selectedCategory }
};

export default useCategories;