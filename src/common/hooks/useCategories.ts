import React from 'react';
import { useSelector } from 'react-redux';
import { selectCategories } from '../../features/categories/categoriesSlice';

type category = ReturnType<typeof selectCategories>[0];
export type categoryWithSub = category & {
    subcategories?: categoryWithSub[];
};

const useCategories = () => {
    const [categoriesTree, setCategoriesTree] = React.useState([] as categoryWithSub[]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const categories = useSelector(selectCategories);
    const categoriesCopy = JSON.parse(JSON.stringify(categories)) as typeof categories;

    const getSubcategories = (cat: typeof categoriesCopy[number]) => {
        const subcategories = categories.filter(c => c._parentId == cat.UUID);
        if (!subcategories.length) {
            return cat;
        };
        const withSubcategory: categoryWithSub = { ...cat, subcategories: subcategories.map(getSubcategories) };
        return withSubcategory;
    };

    React.useEffect(() => {
        const categoriesTree = categoriesCopy.map(getSubcategories);
        setCategoriesTree(categoriesTree);
    }, [categories])

    const topLevelCategories = categoriesTree.filter(cat => !cat._parentId);

    const selectedCategory = topLevelCategories[selectedIndex];

    return { categoriesTree, topLevelCategories, selectedIndex, setSelectedIndex, selectedCategory }
};

export default useCategories;