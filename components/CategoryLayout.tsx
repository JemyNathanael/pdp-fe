import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { ConfigProvider, Layout } from "antd";
import { faArrowRightFromBracket, faUserGear } from '@fortawesome/free-solid-svg-icons'
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
    secondSubCategories: Verse[];
}

interface CategoryDetailModel {
    title: string;
    firstSubCategories: Chapter[];
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

    const [firstSubCategories, setFirstSubCategories] = useState<CategorySidebarItemsModel[]>()

    const router = useRouter();
    const categoryId = router.query['categoryId']?.toString() ?? '';

    const { data: session } = useSession();
    const displayUserName = session?.user?.name;

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data } = useSWR<CategoryDetailModel>(GetCategoryDetail(categoryId), swrFetcher);

    const userRole = session?.user?.['role'][0];
    const isAdmin = userRole === "Admin";
    const goToManageUserPage = () => {
        router.push('/ManageUser');
    }

    useEffect(() => {
        if (data) {
            const firstSubCategoriesItem: CategorySidebarItemsModel[] = data?.firstSubCategories.map((chapter) => {
                // map each verses to make a child menu from each chapters
                const currentChapterVerses: SidebarMenuModel[] = chapter.secondSubCategories.map((verse) => {
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

            setFirstSubCategories(firstSubCategoriesItem);
        }
    }, [data, router.query])

    useEffect(() => {
        if (firstSubCategories) {
            const itemsCollapseStateMap = firstSubCategories.map(() => false);
            setChaptersExpandedState(itemsCollapseStateMap);
        }
    }, [firstSubCategories])

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
        if (chaptersExpandedState) {
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
        <button onClick={onClickLogout} className="pl-4">
            <FontAwesomeIcon className="mr-2" icon={faArrowRightFromBracket} color="white"></FontAwesomeIcon>
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

                <Header className="bg-[#3788FD] px-2 py-1 flex items-center"style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.6)" }}>
                    <div className="flex flex-1 items-center">
                        <div onClick={() => router.push('/')} style={{ flexGrow: 1, }}>
                            <img src="adaptist-white-logo.png" alt="logo" style={{ maxWidth: '160px', margin: '8px'}} />
                        </div>
                        <div className="p-6 flex flex-1 flex-row-reverse items-center">

                            {logoutButton()}
                            {isAdmin &&
                                <button onClick={goToManageUserPage} style={{ color: 'white' }}>
                                    <FontAwesomeIcon icon={faUserGear} />
                                </button>
                            }
                            <div className="mr-6 text-sm text-white font-bold">
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
                            {firstSubCategories &&
                                firstSubCategories.map((firstSub, i) =>
                                    <Collapsible
                                        open={openAll}
                                        title={firstSub.title}
                                        routePath={firstSub.routePath}
                                        childrenItem={firstSub.children}
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
