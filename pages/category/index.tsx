import React from 'react';
import { Title } from '../../components/Title';
import { Page } from '../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';

const Category: React.FC = () => {

    return (
        <div></div>
    );
};

const CategoryPage: Page = () => {
    return (
        <div>
            <Title>Category</Title>
            <Category></Category>
        </div>
    );
}

CategoryPage.layout = WithCategoryLayout;
export default CategoryPage;
