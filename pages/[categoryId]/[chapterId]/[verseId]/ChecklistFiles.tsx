import React, { useEffect, useState } from 'react';
import { Title } from '../../../../components/Title';
import { Page } from '../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { CategoryUploadedFileView } from '@/components/category/CategoryUploadedFileView';
import { useRouter } from 'next/router';
import { CategoryButton } from '@/components/category/CategoryButton';
import { Authorize } from '@/components/Authorize';
import { Upload, UploadProps } from 'antd';

interface Checklist {
    status: 'Sesuai Sepenuhnya' | 'Sesuai Sebagian' | 'Tidak Sesuai' | 'Tidak Dapat Diterapkan';
    title: string;
    uploadedFiles: string[];
}

const dummyChecklist: Checklist = {
    status: 'Sesuai Sepenuhnya',
    title: 'Apakah Anda dapat menunjukkan bahwa subjek data pribadi telah menyetujui pemrosesan data mereka?',
    uploadedFiles: ['file-1.pdf', 'file-2.png', 'file-3.docx', 'file-4.pdf', 'file-6.xlsx', 'file-7.xlsx', 'file-8.xlsx', 'file-9.xlsx', 'file-10.xlsx', 'file-11.xlsx', 'file-5.docx']
}

const ChecklistFiles: React.FC = () => {
    const router = useRouter();

    const [files, setFiles] = useState<string[]>();

    function navigateBackToVerse() {
        router.back();
    }

    // may need modification after integration
    function removeFileByIndex(fileIndex: number) {
        if (files) {
            setFiles(files.filter((file, i) => i !== fileIndex));
        }
    }

    const handleChange: UploadProps['onChange'] = (info) => {
        const newFileList = info.fileList;
        const newFileListNames = newFileList.map((file) => file.name);

        setFiles((prev) => {
                if (prev?.length){
                    return [...prev, ...newFileListNames];
                } else {
                    return newFileListNames;
                }
            });            
    }

    const uploadProps = {
        onChange: handleChange,
        multiple: true,
        showUploadList: false,
    };

    useEffect(() => {
        setFiles(dummyChecklist.uploadedFiles)
    }, []);

    return (
        <div className='flex flex-1'>
            <div>
                <button onClick={navigateBackToVerse}>
                    <FontAwesomeIcon icon={faCircleLeft} className='text-[#4F7471] mr-5' size={'2x'}/>
                </button>
            </div>

            <div className='flex-1'>
                <p className='text-base mb-10'>
                    {dummyChecklist.title}
                </p>
                <div className='flex flex-wrap gap-16'>
                    {   files &&
                        files?.map((file, i) => 
                            <CategoryUploadedFileView
                            currentIndex={i}
                            filename={file}
                            removeFileByIndex={removeFileByIndex}
                            key={i}
                            />
                        )
                    }
                </div>

                <div className='flex flex-1 flex-row-reverse mt-24'>
                    <CategoryButton text='Save' className='px-9 ml-8'/>
                    <Upload {...uploadProps}>
                        <CategoryButton text='+ Upload File' mode='outlined' className='px-9' />
                    </Upload>
                </div>
                <p className='flex flex-1 flex-row-reverse mt-3 text-red-500 text-xs font-semibold'>
                    *Format Files: PDF, PNG, Word, and Excel
                </p>
            </div>

        </div>
    )
}

const VerseChecklistFilesPage: Page = () => {
    return (
        <Authorize>
            <Title>Checklist</Title>
            <ChecklistFiles />
        </Authorize>
    );
}

VerseChecklistFilesPage.layout = WithCategoryLayout;
export default VerseChecklistFilesPage;
