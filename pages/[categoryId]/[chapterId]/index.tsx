import React, { useEffect, useState } from 'react';
import { Title } from '../../../components/Title';
import { Page } from '../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Authorize } from '@/components/Authorize';
import { useRouter } from 'next/router';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { GetCategoryDetail, GetProgress } from '@/functions/BackendApiUrl';
import { CategoryVerseFloatingButton } from '@/components/category/CategoryVerseFloatingButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Progress } from 'antd';

interface ChapterModel {
    title: string;
    firstSubCategories: ChapterDetailModel[];
}

interface ChapterDetailModel {
    id: string;
    title: string;
    secondSubCategories?: ChecklistModel[];
    createdAt: Date;
}

interface ChecklistModel {
    id: string;
    title: string;
}


export interface ProgressModel{
    id: string;
    title: string;
    totalItem: number;
    itemDone: number;
    secondSubCategories: {
        id: string;
        totalItem: number;
        itemDone: number;
    }[]
}

interface ProgressPercentage{
    id: string;
    totalItems: number | undefined;
    itemDone: number;
    percent: number;
}

const Chapter: React.FC = () => {
    const router = useRouter();
    const currentPath = router.asPath

    const swrFetcher = useSwrFetcherWithAccessToken();
    const categoryId = router.query['categoryId']?.toString() ?? '';
    const chapterId = router.query['chapterId']?.toString() ?? '';
    const { data } = useSWR<ChapterModel>(GetCategoryDetail(categoryId), swrFetcher);
    const { data: percentData } = useSWR<ProgressModel[]>(GetProgress(categoryId),swrFetcher);
    const [percentage, setPercentage] = useState<ProgressPercentage[]>();
    const [chapterProgress, setProgress] = useState<ProgressPercentage>();
    const currentChapter = data?.firstSubCategories.find((chapter) => chapter.id === chapterId);
    const checklist = currentChapter?.secondSubCategories;

    const { data: session } = useSession();

    const role = session?.user?.['role'][0];
    const canEditUploadStatusRole = ['Admin', 'Auditor'];
    const isRoleGrantedEditUploadStatus = canEditUploadStatusRole.includes(role) ? true : false;
   

    const getColorForIndex = (percent) => {
        if(percent == 100){
            return '#3A86FF';
        }else if(percent >= 81 && percent <= 99){
            return '#27AE60'
        }else if(percent >= 51 && percent <= 80){
            return '#FFC300';
        }else{
            return '#CC0404';
        }
      };

    useEffect(() => {
        const progressList: ProgressPercentage[] = [];
        percentData?.map((first) => {
            first.secondSubCategories.map((second) => {
                const progress: ProgressPercentage = {
                    id: second.id,
                    totalItems: second.totalItem,
                    itemDone: second.itemDone,
                    percent: Math.round((second.itemDone / second.totalItem) * 100)
                }
                progressList.push(progress);

            })
            if(first.id === currentChapter?.id){
                const chapterProgress: ProgressPercentage = {
                    id: categoryId,
                    totalItems: first.totalItem,
                    itemDone: first.itemDone,
                    percent: Math.round((first.itemDone/ first.totalItem) * 100)
                }
                setProgress(chapterProgress);
            }
        });

        setPercentage(progressList);
    } ,[percentData,categoryId, currentChapter?.id])

    return (
        <div>
            <div className='inline-flex shadow-lg w-full mb-5'>
                    <div className='my-auto mx-5 p-2'>
                    <Progress
                            type="dashboard"
                            percent={(Number.isNaN(chapterProgress?.percent)) ? 0 : chapterProgress?.percent}
                            gapDegree={70}
                            strokeWidth={16}
                            strokeColor={getColorForIndex(chapterProgress?.percent)}
                            strokeLinecap="butt"
                            size={200}
                            format={() => 
                                (
                                    <div className="flex justify-center">
                                        <div className="text-2xl  rounded-full font-bold
                                             text-white w-20 h-20 flex items-center justify-center p-10"
                                             style={{backgroundColor: getColorForIndex(chapterProgress?.percent)}}
                                        >
                                            {(Number.isNaN(chapterProgress?.percent)) ? 0 : chapterProgress?.percent}%
                                        </div>
                                        <div className="absolute text-2xl font-bold top-24" style={{color:getColorForIndex(chapterProgress?.percent)}}>
                                            Total
                                        </div>
                                    </div>
                                )}
                        />

                    </div>
                    <div className='my-auto mx-5 w-full'>
                        <h1 className='text-2xl' style={{color:getColorForIndex(chapterProgress?.percent)}}><b>{currentChapter?.title}</b></h1>
                        <br />
                        <p  style={{color:getColorForIndex(chapterProgress?.percent)}}><b>Total : {chapterProgress?.itemDone}/{chapterProgress?.totalItems}</b> </p>
                        <Progress strokeColor={getColorForIndex(chapterProgress?.percent)} percent={chapterProgress?.percent} showInfo={false}></Progress>
                    </div>
                </div>
            <div>
                {
                    checklist?.map((childProps, i) => 
                    <div key={i} >
                        <Link href={`${currentPath}/${childProps.id}`}>
                            <p style={{fontSize:'large'}}><b>{childProps.title}</b></p>
                        </Link>
                        <div>
                            {
                                percentage?.map((item,j) => (
                                    item.id === childProps.id && (
                                        <div key={j} >
                                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                                <p style={{fontWeight:"bold", color:getColorForIndex(item.percent)}}>{item.percent}%</p>
                                                <p>{item?.itemDone}/{item.totalItems}</p>
                                            </div>
                                            <Progress percent={item.percent} strokeColor={getColorForIndex(item.percent)} showInfo={false}/>
                                        </div>
                                        
                                    )
                                  ))
                            }
                        </div>
                    </div>
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
