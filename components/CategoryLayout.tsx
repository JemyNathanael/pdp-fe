import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { ConfigProvider, Layout } from "antd";
import { faHome, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Collapsible from "./category/Collapsible";
import { signOut, useSession } from "next-auth/react";
import nProgress from "nprogress";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { GetCategoryDetail } from "@/functions/BackendApiUrl";
import useSWR from 'swr';
import { Authorize } from "./Authorize";

const { Sider, Content, Header } = Layout;

const sidebarBackgroundColor = '#4F7471';

interface Verse {
    id: string;
    title: string;
    description: string;
    chapterId: string;
    chapter: string;
    checklistId: string[];
    isUploadFile: boolean;
    uploadStatusId: number;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

interface Chapter {
    id: string;
    title: string;
    description: string;
    isUploadFile: boolean;
    verses: Verse[];
}

interface CategoryDetailModel {
    title: string;
    chapters: Chapter[];
}

interface SidebarMenuModel {
    title: string;
    routePath: string;
}

interface CategorySidebarItemsModel extends SidebarMenuModel {
    children: SidebarMenuModel[]
}

const CategoryLayout: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {

    const [openAll, setOpenAll] = useState(false);
    const [toggledFromCollapseOrExpandAll, setToggledFromCollapseOrExpandAll] = useState(false);
    const [chaptersExpandedState, setChaptersExpandedState] = useState<boolean[]>()
    
    const [chapters, setChapters] = useState<CategorySidebarItemsModel[]>() 
    
    const router = useRouter();
    const categoryId = router.query['categoryId']?.toString() ?? '';

    const { data: session } = useSession();
    const displayUserName = session?.user?.name;

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data } = useSWR<CategoryDetailModel>(GetCategoryDetail(categoryId), swrFetcher);

    useEffect(() => {
        if(data){
            const chaptersItem: CategorySidebarItemsModel[] = data?.chapters.map((chapter) => {
                // map each verses to make a child menu from each chapters
                const currentChapterVerses: SidebarMenuModel[] = chapter.verses.map((verse) => {
                    return {
                        title: verse.title,
                        routePath: `/${router.query['categoryId']}/${chapter.id}/${verse.id}`
                    }
                })
    
                return {
                    title: chapter.title,
                    routePath: `/${router.query['categoryId']}/${chapter.id}`,
                    children: currentChapterVerses,
                }
            })

            setChapters(chaptersItem);
        }
    }, [data, router.query])

    useEffect(() => {
        if(chapters) {
            const itemsCollapseStateMap = chapters.map(() => false);
            setChaptersExpandedState(itemsCollapseStateMap);
        }
    }, [chapters])

    function changeCollapseStatusByIndex(index: number, state: boolean) {
        const tempStateMap = chaptersExpandedState;
        if (tempStateMap) {
            tempStateMap[index] = state;
            setChaptersExpandedState(tempStateMap);
        }
    }

    function resetToggleFromButtonState() {
        setToggledFromCollapseOrExpandAll(false);
    }

    function handleExpandOrCollapseAll() {
        setToggledFromCollapseOrExpandAll(true);
        if(chaptersExpandedState) {
            const isAllExpanded = chaptersExpandedState.every(state => state === true);
            if (isAllExpanded) {
                setOpenAll(false);
            } else {
                setOpenAll(true);
            }
        }
    }

    function onClickLogout() {
        nProgress.start();
            signOut({
                callbackUrl: '/api/end-session'
            });
    }

    const logoutButton = () => (
        <button onClick={onClickLogout} className="flex items-center text-[#4F7471] font-semibold border-2 border-[#4F7471] h-9 px-3 rounded-full">
            <FontAwesomeIcon className="mr-2" icon={faArrowRightFromBracket} color="#4F7471"></FontAwesomeIcon>
            Logout
        </button>
    )

    return (
        <ConfigProvider theme={{
            components: {
                Layout: {
                    // Sidebar background color:
                    // https://github.com/ant-design/ant-design/blob/5.0.0/components/layout/style/index.tsx#L101
                    colorBgHeader: sidebarBackgroundColor
                }
            }
        }}>
            <Layout className="min-h-screen">
                <Head>
                    <meta key="meta-charset" charSet="utf-8" />
                    <meta key="meta-viewport" name="viewport" content="width=device-width, initial-scale=1" />
                    <link key="favicon" rel="icon" href="/favicon.ico" />
                </Head>

                <Header className="bg-white px-0 flex items-center">
                    <div className="flex flex-1 items-center">
                        <button className="p-6 border-r-2 border-r-gray-200" onClick={() => router.push('/')}>
                            <FontAwesomeIcon icon={faHome} color="#4F7471" className="fa-xl"></FontAwesomeIcon>
                        </button>
                        <div className="p-6 flex-1 text-[#4F7471] font-bold text-xl">
                            LOGO
                        </div>
                        <div className="p-6 flex flex-1 flex-row-reverse items-center">
                            {logoutButton()}
                            <div className="mr-6 font-semibold text-xs">
                                Halo, {displayUserName}
                            </div>
                        </div>
                    </div>
                </Header>
                
                <Layout>
                    <Sider width={300} className="pb-24 hidden lg:block">
                        <p className="p-2 px-4 m-4 text-white font-bold">
                            {data?.title}
                        </p>
                        <div className="m-4">
                            { chapters &&
                                chapters.map((chapter, i) =>
                                    <Collapsible
                                    open={openAll}
                                    title={chapter.title}
                                    routePath={chapter.routePath}
                                    childrenItem={chapter.children}
                                    changeCollapseStatus={changeCollapseStatusByIndex}
                                    resetToggle={resetToggleFromButtonState}
                                    toggledFlag={toggledFromCollapseOrExpandAll}
                                    currentIndex={i}
                                    key={i}
                                    /> 
                                )
                            }
                        </div>
                        <button className="mx-8 mt-5 text-white underline text-xs" onClick={handleExpandOrCollapseAll}>
                            Expand / Collapse all
                        </button>
                    </Sider>
            
                    <Content className="p-7">
                        {children}
                    </Content>
                </Layout>

            </Layout>
        </ConfigProvider>
    );
}

export const WithCategoryLayout = (page: React.ReactElement) => 
<Authorize>
    <CategoryLayout>
        {page}
    </CategoryLayout>
</Authorize>;
