import React, { useState } from "react";
import Head from 'next/head';
import { ConfigProvider, Layout } from "antd";
import { faHome, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Collapsible from "./Collapsible";

const { Sider, Content, Header } = Layout;

const sidebarBackgroundColor = '#4F7471';

const CategoryLayout: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {

    const [openAll, setOpenAll] = useState(false);
    const [toggledFromCollapseOrExpandAll, setToggledFromCollapseOrExpandAll] = useState(false);
    const router = useRouter();
     
    const clauses = [
        {
            title: 'Pasal 22',
            routePath: '/category/22',
            children: [
                {
                    title: 'Ayat 1',
                    routePath: '/category/22/1'
                },
                {
                    title: 'Ayat 2',
                    routePath: '/category/22/2'
                }
            ]
        },
        {
            title: 'Pasal 5',
            routePath: '/category/5',
            children: [
                {
                    title: 'Ayat 1',
                    routePath: '/category/5/1'
                }
            ]
        },
    ];
    
    const itemsCollapseStateMap = clauses.map(() => false);

    function changeCollapseStatusByIndex(index: number, state: boolean) {
        itemsCollapseStateMap[index] = state;
        console.log(itemsCollapseStateMap);
    }

    function resetToggleFromButtonState() {
        setToggledFromCollapseOrExpandAll(false);
    }

    function handleExpandOrCollapseAll() {
        setToggledFromCollapseOrExpandAll(true);
        console.log(itemsCollapseStateMap);
        const isAllExpanded = itemsCollapseStateMap.every(state => state === true);
        if (isAllExpanded) {
            setOpenAll(false);
        } else {
            setOpenAll(true);
        }
    }

    const logoutButton = () => (
        <button className="flex items-center text-[#4F7471] font-semibold border-2 border-[#4F7471] h-9 px-3 rounded-full">
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
                        <button className="p-6 border-r-2 border-r-gray-200">
                            <FontAwesomeIcon icon={faHome} color="#4F7471" className="fa-xl" onClick={() => router.push('/')}></FontAwesomeIcon>
                        </button>
                        <div className="p-6 flex-1 text-[#4F7471] font-bold text-xl">
                            LOGO
                        </div>
                        <div className="p-6 flex flex-1 flex-row-reverse items-center">
                            {logoutButton()}
                            <div className="mr-6 font-semibold text-xs">
                                Halo, Nama
                            </div>
                        </div>
                    </div>
                </Header>
                
                <Layout>
                    <Sider width={300} className="pb-24 hidden lg:block">
                        <div className="p-2 px-4 m-4 text-white font-bold">
                            Placholder Title
                        </div>
                        <div className="m-4">
                            {
                                clauses.map((clause, i) =>
                                    <Collapsible
                                    open={openAll}
                                    title={clause.title}
                                    routePath={clause.routePath}
                                    childrenItem={clause.children}
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

export const WithCategoryLayout = (page: React.ReactElement) => <CategoryLayout>{page}</CategoryLayout>;
