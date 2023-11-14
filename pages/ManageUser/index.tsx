import { WithDefaultLayout } from '@/components/DefautLayout';
import { Page } from '@/types/Page';
import React from 'react'
import OverviewUser from './overviewUser';

const TabNavigation = () => {
    return (
        <div className="bg-white mb-5">
            <nav className="flex flex-col sm:flex-row">
                <button className="py-4 px-6 block hover:text-[#4F7471] focus:outline-none border-b-2 font-medium border-[#4F7471] text-[#4F7471]">
                    Overview
                </button>
                <button className="text-gray-600 py-4 px-6 block hover:text-[#4F7471] focus:outline-none">
                    Log
                </button>
            </nav>
            <hr />
        </div>
    );
}

const ManageUser: Page = () => {
    return (
        <div>
            <h1 className='text-xl font-semibold mb-5'>MANAGE USER</h1>
            <TabNavigation />
            <OverviewUser />
        </div>
    );
}
ManageUser.layout = WithDefaultLayout
export default ManageUser;
