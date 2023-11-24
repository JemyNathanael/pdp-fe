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
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { GetChecklistList } from '@/functions/BackendApiUrl';


export interface BlobListModel{
    id: string;
    fileName: string;
    filePath: string;
    contentType: string;
}

interface ChecklistList {
    id: string;
    description: string;
    uploadStatusId: number;
    blobList: BlobListModel[];
}

interface ChecklistModel {
    successStatus: boolean;
    checklistList: ChecklistList[];
}


const ChecklistFiles: React.FC = () => {
    const router = useRouter();

    const [files, setFiles] = useState<string[]>();
    
    const verseId = router.query['verseId']?.toString() ?? '';
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: checklistData } = useSWR<ChecklistModel>(GetChecklistList(verseId), swrFetcher);
    const listData = checklistData?.checklistList[0]?.blobList.map(item => item.fileName);
    const titleData = checklistData?.checklistList[0]?.description;
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
        setFiles(listData)
    }, [listData]);

    return (
        <div className='flex flex-1'>
            <div>
                <button onClick={navigateBackToVerse}>
                    <FontAwesomeIcon icon={faCircleLeft} className='text-[#4F7471] mr-5' size={'2x'}/>
                </button>
            </div>

            <div className='flex-1'>
                <p className='text-base mb-10'>
                    {titleData}
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
