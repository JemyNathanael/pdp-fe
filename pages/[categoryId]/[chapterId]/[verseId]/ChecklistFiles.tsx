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
import { Upload } from 'antd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR, { mutate } from 'swr';
import { BackendApiUrl, GetChecklistList } from '@/functions/BackendApiUrl';
import { useSession } from 'next-auth/react';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';



export interface BlobListModel {
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

    const [files, setFiles] = useState<ChecklistList[]>();
    const canEditUploadStatusRole = ['Admin', 'Auditor'];
    const { data: session } = useSession();
    const role = session?.user?.['role'][0];
    const verseId = router.query['verseId']?.toString() ?? '';

    const isRoleGrantedEditUploadStatus = canEditUploadStatusRole.includes(role) ? true : false;
    const { fetchPOST } = useFetchWithAccessToken();

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: checklistData } = useSWR<ChecklistModel>(GetChecklistList(verseId), swrFetcher);
    const titleData = checklistData?.checklistList.map(title => title.description);
    function navigateBackToVerse() {
        router.back();
    }

    function removeFileFromChecklist(checklistIndex: number, fileIndex: number) {
        if (files) {
            const tempChecklist = files.map((checklist, cIndex) => {
                const tempFiles = checklist.blobList?.filter((files, fIndex) => {
                    if (cIndex !== checklistIndex || fIndex !== fileIndex) {
                        return true;
                    } else {
                        return false;
                    }
                })

                const newChecklist: ChecklistList = {
                    id: checklist.id,
                    description: checklist.description,
                    uploadStatusId: checklist.uploadStatusId,
                    blobList: tempFiles,
                }
                return newChecklist
            })

            setFiles(tempChecklist);
        }
    }

    const handleFileUpload = async (info) => {
        if (info.file.status === 'done') {
            const targetChecklist = files?.find((checklist) =>
                checklist.blobList.some((blob) => blob.fileName === info.file.name)
            );

            if (targetChecklist) {
                const payload = {
                    Id: info.file.response.fileId,
                    FilePath: info.file.response.filePath,
                    FileName: info.file.response.fileName,
                    ContentType: info.file.response.contentType,
                    ChecklistId: targetChecklist.id,
                };

                await fetchPOST(BackendApiUrl.uploadFileInformation, payload);

                mutate(GetChecklistList(verseId));
            }
        }
    };



    useEffect(() => {
        setFiles(checklistData?.checklistList)
    }, [checklistData?.checklistList]);

    return (
        <div className='flex flex-1'>
            <div>
                <button onClick={navigateBackToVerse}>
                    <FontAwesomeIcon icon={faCircleLeft} className='text-[#4F7471] mr-5' size={'2x'} />
                </button>
            </div>

            <div className='flex-1'>
                <p className='text-base mb-10'>
                    {titleData}
                </p>
                <div className='flex flex-wrap gap-16'>
                    {files &&
                        files.map((file, i) =>
                            file.blobList.map((blob, j) => (
                                <CategoryUploadedFileView
                                    key={`${i}-${j}`}
                                    currentIndex={i}
                                    filename={blob.fileName}
                                    removeFileByIndex={() => removeFileFromChecklist(i, j)}
                                />
                            ))
                        )
                    }
                </div>

                <div className='flex flex-1 flex-row-reverse mt-24'>
                    <CategoryButton text='Save' className='px-9 ml-8' />
                    {isRoleGrantedEditUploadStatus &&
                        <Upload name='file' action={BackendApiUrl.uploadFile} onChange={handleFileUpload} defaultFileList={[]}>
                            <CategoryButton text='+ Upload File' mode='outlined' className='px-9' />
                        </Upload>
                    }

                </div>
                <p className='flex flex-1 flex-row-reverse mt-3 text-red-500 text-xs font-semibold'>
                    *Format Files: PDF, PNG, docx, and xlsx 
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
