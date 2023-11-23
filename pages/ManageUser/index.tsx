import { WithDefaultLayout } from '@/components/DefautLayout';
import { Page } from '@/types/Page';
import React, { useState } from 'react'
import OverviewUser from './overviewUser';
import LogUser from './logUser';
import { Authorize } from '@/components/Authorize';

const TabNavigation = () => {
    const [activeTab, setActiveTab] = useState(1);
    const tabClasses = (tabNumber) =>
        `px-4 py-2 text-sm font-medium ${activeTab === tabNumber
            ? "text-greyeen border-b-4 border-greyeen"
            : "text-gray-700"
        }`;

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };
    return (
        <div>
            <div className="flex w-full">
                <div className="border-b">
                    <nav className="-mb-px flex">
                        <button
                            className={`w-full ${tabClasses(1)} mr-5`}
                            onClick={() => handleTabClick(1)}
                        >
                            <p className='text-center'>Overview</p>
                        </button>
                    </nav>
                </div>
                <div className="border-b">
                    <nav className="-mb-px flex">
                        <button
                            className={`w-full ${tabClasses(2)}`}
                            onClick={() => handleTabClick(2)}
                        >
                            <p className='text-center'>Log</p>
                        </button>
                    </nav>
                </div>
            </div>
            <hr className='border-neutral-300' />
            <div>
                <div className="py-4 w-full">
                    <div className="h-full overflow-y-auto py-4">
                        {activeTab === 1 &&
                            <div className="w-75 rounded-lg my-3 mx-auto">
                                <OverviewUser></OverviewUser>
                            </div>
                        }
                        {activeTab === 2 &&
                            <div className="w-75 rounded-lg my-3 mx-auto">
                                <LogUser></LogUser>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

const ManageUser: Page = () => {
    return (
        <Authorize>
            <div>
                <h1 className='text-2xl font-bold my-5'>Manage User</h1>
                <TabNavigation />
            </div >
        </Authorize>
    );
}

ManageUser.layout = WithDefaultLayout
export default ManageUser;
