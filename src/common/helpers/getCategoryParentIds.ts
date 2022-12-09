import { CategoryInState } from "../../../server/helpers";

export default function getCategoryParentIds(categoryId: string, categories: CategoryInState[]) {
    const category = categories.find(cat => cat.UUID == categoryId);
    const categoryIds = [category?.UUID];
    let parentCategory = categories.find(cat => cat.UUID == category?._parentId);
    while (parentCategory) {
        categoryIds.push(parentCategory.UUID);
        parentCategory = categories.find(cat => cat.UUID == parentCategory?._parentId);
    };
    return <string[]>categoryIds.filter(c => c != undefined);
};