import React from 'react';
import { Title } from '../../../components/Title';
import { Page } from '../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Authorize } from '@/components/Authorize';
import { useRouter } from 'next/router';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { GetCategoryDetail } from '@/functions/BackendApiUrl';

interface ChapterDetailModel {
    id: string;
    title: string;
    description: string;
}

interface ChapterModel {
    title: string;
    chapters: ChapterDetailModel[];
}

const Chapter: React.FC = () => {
    const router = useRouter();

    const swrFetcher = useSwrFetcherWithAccessToken();
    const categoryId = router.query['categoryId']?.toString() ?? '';
    const chapterId = router.query['chapterId']?.toString() ?? '';
    const { data } = useSWR<ChapterModel>(GetCategoryDetail(categoryId), swrFetcher);
    const currentChapter = data?.chapters.find((chapter) => chapter.id === chapterId);
    return (
        <div>
            <div className="text-3xl font-semibold mb-5">
                {currentChapter?.title}
            </div>
            <p>
                {currentChapter?.description}
            </p>
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
