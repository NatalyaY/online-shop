import React from 'react';
import { useSelector } from 'react-redux';
import { selectCategories } from '../../features/categories/categoriesSlice';

type category = ReturnType<typeof selectCategories>[number];
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

const useCategories = (categoriesProp: ReturnType<typeof selectCategories> | undefined = undefined) => {
    const [categoriesTree, setCategoriesTree] = React.useState<categoryWithSub[]>([]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const categories = categoriesProp || useSelector(selectCategories);
    const categoriesCopy = JSON.parse(JSON.stringify(categories)) as typeof categories;

    React.useEffect(() => {
        const categoriesTree = categoriesCopy.map(cat => getSubcategories(cat, categories));
        setCategoriesTree(categoriesTree);
    }, [categories])

    const topLevelCategories = categoriesTree.filter(cat => !cat._parentId);

    const selectedCategory = topLevelCategories[selectedIndex];

    return { categoriesTree, topLevelCategories, selectedIndex, setSelectedIndex, selectedCategory }
};

export default useCategories;