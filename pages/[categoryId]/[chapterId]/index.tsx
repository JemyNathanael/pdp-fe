import React from 'react';
import { Title } from '../../../components/Title';
import { Page } from '../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Authorize } from '@/components/Authorize';
import { useRouter } from 'next/router';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { GetCategoryDetail } from '@/functions/BackendApiUrl';
import { CategoryVerseFloatingButton } from '@/components/category/CategoryVerseFloatingButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface ChapterDetailModel {
    id: string;
    title: string;
    secondSubCategories?: ChildProps[];
    createdAt: Date;
}

interface ChildProps {
    id: string;
    title: string;
}

interface ChapterModel {
    title: string;
    firstSubCategories: ChapterDetailModel[];
}

const Chapter: React.FC = () => {
    const router = useRouter();
    const currentPath = router.asPath

    const swrFetcher = useSwrFetcherWithAccessToken();
    const categoryId = router.query['categoryId']?.toString() ?? '';
    const chapterId = router.query['chapterId']?.toString() ?? '';
    const { data } = useSWR<ChapterModel>(GetCategoryDetail(categoryId), swrFetcher);
    const currentChapter = data?.firstSubCategories.find((chapter) => chapter.id === chapterId);
    const checklist = currentChapter?.secondSubCategories;

    const { data: session } = useSession();

    const role = session?.user?.['role'][0];
    const canEditUploadStatusRole = ['Admin', 'Auditor'];
    const isRoleGrantedEditUploadStatus = canEditUploadStatusRole.includes(role) ? true : false;

    return (
        <div>
            <div className="text-xl font-semibold mb-5 text-[#3788FD]">
                {currentChapter?.title}
            </div>
            <div>
                {
                    checklist?.map((childProps, i) => 
                        <Link key={i} href={`${currentPath}/${childProps.id}`}>
                            <p style={{fontSize:'large'}}><b>{childProps.title}</b></p>
                        </Link>
                    )
                }

            </div>
            {isRoleGrantedEditUploadStatus &&
                <CategoryVerseFloatingButton categoryId={categoryId} />
            }
        </div>
    );
};

const ChapterPage: Page = () => {
    return (
        <Authorize>
            <Title>Pasal</Title>
            <Chapter></Chapter>
        </Authorize>
    );
}

ChapterPage.layout = WithCategoryLayout;
export default ChapterPage;
