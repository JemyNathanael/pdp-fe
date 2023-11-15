import React, { FC } from 'react';
import { Title } from '../../../../components/Title';
import { Page } from '../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Select } from 'antd';

interface selectType {
    value: string;
    label: string;
}

const selectOptions: selectType[] = [
    {
        label: 'Sesuai Sepenuhnya',
        value: 'Sesuai Sepenuhnya'
    },
    {
        label: 'Sesuai Sebagian',
        value: 'Sesuai Sebagian'
    },
    
    {
        label: 'Tidak Sesuai',
        value: 'Tidak Sesuai'
    },
    {
        label: 'Tidak Dapat Diterapkan',
        value: 'Tidak Dapat Diterapkan'
    },
]

const VersePage: Page = () => {
    return (
        <div>
            <Title>Ayat</Title>
            <div className='flex'>
                <Select
                    className='w-56 rounded-none'
                    defaultValue={selectOptions[0]?.label}
                    options={selectOptions} 
                />
                <div className='bg-blue-300 flex flex-1'>

                </div>
            </div>
        </div>
    );
}

VersePage.layout = WithCategoryLayout;
export default VersePage;
