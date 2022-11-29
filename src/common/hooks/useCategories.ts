import React from 'react';
import { useSelector } from 'react-redux';
import { selectCategories } from '../../features/categories/categoriesSlice';


const useCategories = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const categories = useSelector(selectCategories);
    const categoriesCopy: typeof categories = JSON.parse(JSON.stringify(categories));

    const topLevelCategories = categoriesCopy.filter(cat => !cat._parentId);

    const selectedCategory = topLevelCategories[selectedIndex];

    return { categoriesTree: categoriesCopy, topLevelCategories, selectedIndex, setSelectedIndex, selectedCategory }
};

export default useCategories;