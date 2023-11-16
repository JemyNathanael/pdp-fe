import React from 'react';
import { Title } from '../../../../components/Title';
import { Page } from '../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { CategoryVerseContent } from '@/components/CategoryVerseContent';
import { CategoryButton } from '@/components/CategoryButton';

interface Checklist {
    status: 'Sesuai Sepenuhnya' | 'Sesuai Sebagian' | 'Tidak Sesuai' | 'Tidak Dapat Diterapkan';
    title: string;
    uploadedFiles?: string[];
}

const dummyChecklist: Checklist[] = [
    {
        status: 'Sesuai Sepenuhnya',
        title: 'Apakah Anda dapat menunjukkan bahwa subjek data pribadi telah menyetujui pemrosesan data mereka?',
        uploadedFiles: ['file-1.pdf', 'file-2.png', 'file-3.docx', 'file-4.pdf', 'file-5.xlsx']
    }, 
    {
        status: 'Sesuai Sepenuhnya',
        title: 'Apakah permintaan persetujuan dapat dibedakan dengan jelas dari hal-hal lain, dengan cara yang dapat dimengerti dan dalam bentuk yang mudah diakses, dan ditulis dalam bahasa yang jelas dan lugas?',
    }, 
] 

const VersePage: Page = () => {

    // checklistIndex and fileIndex could be changed to checklist and file unique id after fetching the real data
    function removeFileFromChecklist(checklistIndex: number, fileIndex: number) {
        dummyChecklist[checklistIndex]?.uploadedFiles?.splice(fileIndex, 1)
        console.log(dummyChecklist[0]?.uploadedFiles)
    }

    return (
        <div>
            <Title>Ayat</Title>
            {
                dummyChecklist.map((checklist, i) => 
                    <div key={i} className='mb-16'>
                        <CategoryVerseContent 
                        title={checklist.title}
                        status={checklist.status}
                        uploadedFiles={checklist.uploadedFiles}
                        removeFileFromChecklist={removeFileFromChecklist}
                        checklistIndex={i}
                        />
                    </div>
                )
            }
            <div className='flex flex-row-reverse mr-5'>
                <CategoryButton text='Save' className='px-10'/>
            </div>
        </div>
    );
}

VersePage.layout = WithCategoryLayout;
export default VersePage;
