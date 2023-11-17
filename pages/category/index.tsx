import React from 'react';
import { Title } from '../../components/Title';
import { Page } from '../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Authorize } from '@/components/Authorize';

const Category: React.FC = () => {

    return (
        <div></div>
    );
};

const CategoryPage: Page = () => {
    return (
        <Authorize>
            <Title>Category</Title>
            <Category></Category>
        </Authorize>
    );
}

CategoryPage.layout = WithCategoryLayout;
export default CategoryPage;
