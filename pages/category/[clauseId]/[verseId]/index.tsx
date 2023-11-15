import React from 'react';
import { Title } from '../../../../components/Title';
import { Page } from '../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { Select } from 'antd';
import { CategoryUploadedFileView } from '@/components/CategoryUploadedFile';
import { AButton } from '@/components/Buttons';

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

const dummyFiles = ['file-1.pdf', 'file-2.png']

const VersePage: Page = () => {
    return (
        <div>
            <Title>Ayat</Title>
            <div className='flex'>
                <Select
                    className='w-52 rounded-none'
                    defaultValue={selectOptions[0]?.label}
                    options={selectOptions} 
                />
                <div className='flex-1 mx-5'>
                    <div className='text-base'>
                        Apakah Anda dapat menunjukkan bahwa subjek data pribadi telah menyetujui pemrosesan data mereka?
                    </div>
                    <div className='flex mt-6'>
                        <div className='bg-red-300 flex flex-1'>
                            {
                                dummyFiles.map((file, i) => 
                                <div className='mr-8' key={i}>
                                    <CategoryUploadedFileView filename={file}/>
                                </div>
                                )
                            }
                        </div>
                        <div>
                            <AButton text='+ Upload File'/>
                            {/* <button className='border-[#4F7471] border-[3px] text-[#4F7471] font-semibold'>+ Upload</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

VersePage.layout = WithCategoryLayout;
export default VersePage;
