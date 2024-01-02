import React, { useEffect, useState } from 'react';
import { Title } from '../../components/Title';
import { Page } from '../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { useRouter } from 'next/router';
import { Authorize } from '@/components/Authorize';
import { useSession } from 'next-auth/react';
import { CategoryVerseFloatingButton } from '@/components/category/CategoryVerseFloatingButton';
import useSWR from 'swr';
import { GetCategoryDetail, GetProgress } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { ProgressModel } from './[chapterId]';
import Link from 'next/link';
import { Progress } from 'antd';

interface CategoryDetailModel {
    title: string;
}

interface ProgressPercentage{
    id: string;
    title: string | undefined;
    totalItems: number | undefined;
    itemDone: number;
    percent: number;
}

const Category: React.FC = () => {
    const router = useRouter();
    const currentPath = router.asPath

    const { data: session } = useSession();
    const categoryId = router.query['categoryId']?.toString() ?? '';
    const role = session?.user?.['role'][0];
    const canEditUploadStatusRole = ['Admin', 'Auditor'];
    const isRoleGrantedEditUploadStatus = canEditUploadStatusRole.includes(role) ? true : false;
    const swrFetcher = useSwrFetcherWithAccessToken();

    const { data: percentData } = useSWR<ProgressModel[]>(GetProgress(categoryId),swrFetcher);
    const { data: categoryData } = useSWR<CategoryDetailModel>(GetCategoryDetail(categoryId), swrFetcher);
    const [percentage, setPercentage] = useState<ProgressPercentage[]>();
    const [chartData, setChart] = useState<ProgressPercentage>();

    

    useEffect(() => {
        const progressList: ProgressPercentage[] = [];
        let categoryItems = 0;
        let categoryItemDone = 0;
        percentData?.map((first) => {
            const progress: ProgressPercentage = {
                id: first.id,
                title: first.title,
                totalItems: first.totalItem,
                itemDone: first.itemDone,
                percent: Math.round((first.itemDone / first.totalItem) * 100)
            }
            if((progress.totalItems != null)){
                categoryItems += progress.totalItems;
            }
            categoryItemDone += progress.itemDone;
            progressList.push(progress);
        });
        setPercentage(progressList);

        const categoryProgress: ProgressPercentage = {
            id: categoryId,
            title: categoryData?.title,
            totalItems: categoryItems,
            itemDone: categoryItemDone,
            percent: Math.round((categoryItemDone/ categoryItems) * 100)
        }
        setChart(categoryProgress);
        
    } ,[percentData, categoryData?.title, categoryId])

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

    return (
        <div>
            <div>
                <div className='inline-flex shadow-lg w-full mb-5'>
                    <div className='my-auto mx-5 p-2'>
                    <Progress
                            type="dashboard"
                            percent={(Number.isNaN(chartData?.percent)) ? 0 : chartData?.percent}
                            gapDegree={70}
                            strokeWidth={16}
                            strokeColor={getColorForIndex(chartData?.percent)}
                            strokeLinecap="butt"
                            size={200}
                            format={() => 
                                (
                                    <div className="flex justify-center">
                                        <div className="text-2xl  rounded-full font-bold
                                             text-white w-20 h-20 flex items-center justify-center p-10"
                                             style={{backgroundColor: getColorForIndex(chartData?.percent)}}
                                        >
                                            {(Number.isNaN(chartData?.percent) ? 0 : chartData?.percent)}%
                                        </div>
                                        <div className="absolute text-2xl font-bold top-24" style={{color:getColorForIndex(chartData?.percent)}}>
                                            Total
                                        </div>
                                    </div>
                                )}
                        />

                    </div>
                    <div className='my-auto mx-5 w-full'>
                        <h1 className='text-2xl' style={{color:getColorForIndex(chartData?.percent)}}><b>{chartData?.title}</b></h1>
                        <br />
                        <p  style={{color:getColorForIndex(chartData?.percent)}}><b>Total : {chartData?.itemDone}/{chartData?.totalItems}</b> </p>
                        <Progress strokeColor={getColorForIndex(chartData?.percent)} percent={chartData?.percent} showInfo={false}></Progress>
                    </div>
                </div>
                
                {
                    percentage?.map((item,j) => (
                            <div key={j} >
                                <Link href={`${currentPath}/${item.id}`}>
                                    <p style={{fontSize:'large'}}><b>{item.title}</b></p>
                                </Link>
                                <div style={{display:"flex", justifyContent:"space-between"}}>
                                    <p style={{fontWeight:"bold", color:getColorForIndex(item.percent)}}>{item.percent}%</p>
                                    <p>{item?.itemDone}/{item.totalItems}</p>
                                </div>
                                <Progress percent={item.percent} strokeColor={getColorForIndex(item.percent)} showInfo={false}/>
                            </div>
                            
                    ))
                }
            </div>
            <div>
                {isRoleGrantedEditUploadStatus &&
                    <CategoryVerseFloatingButton categoryId={categoryId} />
                }
            </div>
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