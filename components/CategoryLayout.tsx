import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { ConfigProvider, Layout, Tooltip } from "antd";
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
import SearchResultNav from "./category/SearchResultNav";
import SearchCategoryNavBar from "./category/SearchCategoryNavBar";
import Link from "next/link";
import SearchChecklistNavBar from "./category/checklist/SearchChecklistNavBar";
import SearchChecklistResult from "./category/checklist/SearchChecklistResult";
import SearchFileNavBar from "./category/checklist/SearchFileNavBar";
import SearchFileResult from "./category/checklist/SearchFileResult";

const { Sider, Content } = Layout;

const sidebarBackgroundColor = 'white';

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
    isOpen: boolean;
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

    const [marginLeftValue, setMarginLeftValue] = useState<string>('300px');

    const router = useRouter();
    const categoryId = router.query['categoryId']?.toString() ?? '';

    const { data: session, status } = useSession();
    const displayUserName = session?.user?.name;

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data } = useSWR<CategoryDetailModel>(GetCategoryDetail(categoryId), swrFetcher);

    const userRole = session?.user?.['role'][0];
    const [searchResults, setSearchResults] = useState([]); // Search Bar Result
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
    const isAdmin = userRole === "Admin";
    const isChecklistPage = router.pathname === '/[categoryId]/[chapterId]/[verseId]';
    const isVersePage = router.pathname === '/[categoryId]/[chapterId]/[verseId]/ChecklistFiles';
    const isCategoryPage = router.pathname === '/[categoryId]';
    const goToManageUserPage = () => {
        router.push('/ManageUser');
    }

    const handleResize = () => {
        if (window.innerWidth < 1024) {
            setMarginLeftValue('0');
        } else {
            setMarginLeftValue('300px');
        }
    };

    useEffect(() => {
        if (data) {
            const firstSubCategoriesItem: CategorySidebarItemsModel[] = data?.firstSubCategories.map((chapter) => {
                // map each verses to make a child menu from each chapters
                const currentChapterVerses: SidebarMenuModel[] = chapter.secondSubCategories.map((verse) => {
                    return {
                        title: verse.title,
                        routePath: `/${router.query['categoryId']}/${chapter.id}/${verse.id}`,
                        isOpen: false
                    }
                })

                return {
                    title: chapter.title,
                    routePath: `/${router.query['categoryId']}/${chapter.id}`,
                    children: currentChapterVerses,
                    isOpen: false
                }
            })

            setFirstSubCategories(firstSubCategoriesItem);
        }
    }, [data, router.query])
    // console.log("first category : ", firstSubCategories)
    useEffect(() => {
        if (firstSubCategories) {
            const itemsCollapseStateMap = firstSubCategories.map(() => false);

            const categoryIdFromUrl = router.query['categoryId']?.toString() ?? '';
            const firstSubCategoryIdFromUrl = router.query['chapterId']?.toString() ?? '';
            const secondSubCategoryIdFromUrl = router.query['verseId']?.toString() ?? '';
    
            const selectedChapterIndex = firstSubCategories.findIndex(
                (chapter) => chapter.routePath === `/${categoryIdFromUrl}/${firstSubCategoryIdFromUrl}`
            );

            const shouldKeepFirstSubCategoryExpanded = !!secondSubCategoryIdFromUrl;
    
            setSelectedChapterIndex(selectedChapterIndex);

            itemsCollapseStateMap[selectedChapterIndex] = shouldKeepFirstSubCategoryExpanded;
            setChaptersExpandedState(itemsCollapseStateMap);
        }
    }, [firstSubCategories, router.query]);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
    
        // Check if chaptersExpandedState is defined before using it
        if (chaptersExpandedState) {
            // Check if all chapters are expanded
            const isAllExpanded = chaptersExpandedState.every(state => state === true);
    
            // Update the state based on the current state
            setChaptersExpandedState(chaptersExpandedState.map(() => !isAllExpanded));
    
            // Update the open state based on the current state
            setOpenAll(!isAllExpanded);
        }
    }  

    const handleLogout = () => {
        if (status === 'authenticated') {
            nProgress.start();
            signOut({
                callbackUrl: '/api/end-session',
            });
        }
    }
    // console.log(router)
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

                <nav className="bg-[#3788FD]" style={{
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: '10px',
                    position: 'fixed',
                    width: '100%',
                    zIndex: 2,
                }}>
                    <div className="flex items-center">
                        <div className="hidden md:block logo" onClick={() => router.push('/')} style={{ flexGrow: 1 }}>
                            <img src="/adaptist-white-logo.png" alt="logo" style={{ maxWidth: '200px', margin: '0px 70px 0px 40px' }} className="cursor-pointer" />
                        </div>
                        <div className="flex justify-between w-full">
                            {/* Second Sub Category Page */}
                            {isChecklistPage && (
                                <div style={{ maxWidth: '100%' }} className="mr-2">
                                    <SearchChecklistNavBar setSearchResults={setSearchResults} searchResults={searchResults} />
                                    <SearchChecklistResult searchResults={searchResults} />
                                </div>
                            )}
                            {isCategoryPage && (
                                <div style={{ maxWidth: '100%' }} className="mr-2">
                                    <SearchCategoryNavBar setSearchResults={setSearchResults} searchResults={searchResults} />
                                    <SearchResultNav searchResults={searchResults} />
                                </div>
                            )}
                            {/* View All files */}
                            {isVersePage && (
                                <div style={{ maxWidth: '100%' }} className="mr-2">
                                    <SearchFileNavBar setSearchResults={setSearchResults} searchResults={searchResults} />
                                    <SearchFileResult searchResults={searchResults}/>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-auto lg:grid-flow-col lg:grid-rows-1 items-center">
                                <div className="grid grid-cols-1 lg:grid-cols-auto lg:grid-flow-col lg:grid-rows-1 items-center">
                                    <ul className="lg:flex space-x-4 items-center">
                                        <li className="flex items-center">
                                            <div className="text-white text-base hidden lg:block cursor-pointer font-semibold fontWeight: '600'">
                                                {`Halo, ${displayUserName}`}
                                            </div>
                                            {isAdmin && (
                                                <div className='ml-8'>
                                                    <button
                                                        onClick={goToManageUserPage}
                                                        className="text-white"
                                                    >
                                                        <div style={{
                                                            padding: '4px 8px 3px',
                                                            fontSize: '20px',
                                                            fontWeight: '600',
                                                        }}>
                                                            <FontAwesomeIcon icon={faUserGear} />
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                            <div className='pl-6'>
                                                <button
                                                    onClick={handleLogout}
                                                    className="text-white"
                                                >
                                                    <div style={{
                                                        padding: '4px 8px 3px',
                                                        marginRight: '8.5px',
                                                        fontSize: '20px',
                                                        fontWeight: '600',
                                                    }}>
                                                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                                    </div>
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <Layout>
                    <Sider width={300} className="pb-24 hidden lg:block" style={{ zIndex: 1000, position: 'fixed', height: '100vh', overflowY: 'auto' }}>
                        <div onClick={() => router.push('/')} style={{ flexGrow: 1, }}>
                            <img src='/adaptist-blue-logo.png' alt="logo" style={{ maxWidth: '250px', margin: 'auto' }} className="cursor-pointer" />
                        </div>
                        <Tooltip title={data?.title} placement="right">
                            <Link href={`/${categoryId}`}>
                                <p className="moveLeft p-2 px-4 m-4 text-white font-bold" style={{ backgroundColor: '#3788FD', borderRadius: '10px', opacity: '0.8' }}>
                                    {data?.title}
                                </p>
                            </Link>
                        </Tooltip>
                        <div className="m-4 cursor-pointer" style={{ backgroundColor: '##000000' }}>
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
                                        selectedIndex = {selectedChapterIndex}
                                        currentIndex={i}
                                        key={i}
                                    />
                                )
                            }
                        </div>
                        <button className="mx-8 mt-5 mb-5 text-[#373737] underline text-xs" onClick={handleExpandOrCollapseAll}>
                            Expand / Collapse all
                        </button>
                    </Sider>

                    <Content className="p-7" style={{ paddingTop: 130, marginLeft: marginLeftValue }}>
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