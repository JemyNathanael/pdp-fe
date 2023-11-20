import React, { useEffect, useState } from 'react';
import { Title } from '../../../../components/Title';
import { Page } from '../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { CategoryVerseContent } from '@/components/category/CategoryVerseContent';
import { CategoryButton } from '@/components/category/CategoryButton';
import { Authorize } from '@/components/Authorize';

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

    const [checklist, setChecklist] = useState<Checklist[]>()

    useEffect(() => {
      setChecklist(dummyChecklist);
    }, [])
    
    // May need adjustment after integration
    function removeFileFromChecklist(checklistIndex: number, fileIndex: number) {
        if(checklist) {
            // Iterate every checklist, store it in tmpChecklist
            const tempChecklist = checklist.map((checklist, cIndex) => {
                // on every checklist iteration, filter out the removed file
                const tempFiles = checklist.uploadedFiles?.filter((files, fIndex) => {
                    if(cIndex !== checklistIndex || fIndex !== fileIndex) {
                        return true;
                    } else {
                        return false;
                    }
                })
                // return the new checklist with the filtered out files
                const newChecklist: Checklist = {
                    status: checklist.status,
                    title: checklist.title,
                    uploadedFiles: tempFiles,
                }
                return newChecklist
            })
            // set the checklist state with the new checklist
            setChecklist(tempChecklist);  
        }
    }

    return (
        <Authorize>
            <Title>Ayat</Title>
            {   checklist && 
                checklist.map((checklist, i) => 
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
        </Authorize>
    );
}

VersePage.layout = WithCategoryLayout;
export default VersePage;
