import React from 'react';
import { Title } from '../../components/Title';
import { Page } from '../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { useRouter } from 'next/router';
import { Authorize } from '@/components/Authorize';
import { useSession } from 'next-auth/react';
import { CategoryVerseFloatingButton } from '@/components/category/CategoryVerseFloatingButton';


const Category: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const categoryId = router.query['categoryId']?.toString() ?? '';
    const role = session?.user?.['role'][0];
    const canEditUploadStatusRole = ['Admin', 'Auditor'];
    const isRoleGrantedEditUploadStatus = canEditUploadStatusRole.includes(role) ? true : false;
    

    return (
        <div>
            {isRoleGrantedEditUploadStatus &&
                <CategoryVerseFloatingButton categoryId={categoryId} />
            }
        </div>
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