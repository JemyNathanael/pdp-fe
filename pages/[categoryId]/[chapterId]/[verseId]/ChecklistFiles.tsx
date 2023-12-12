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
import { v4 as uuidv4 } from 'uuid';
import { BackendApiUrl, GetChecklistList } from '@/functions/BackendApiUrl';
import { useSession } from 'next-auth/react';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { RcFile } from 'antd/es/upload';



export interface BlobListModel {
    id: string;
    fileName: string;
    filePath?: string | undefined;
    contentType: string;
    originFileObj?: RcFile | undefined
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

interface ResponseTest {
    data: string;
}


const ChecklistFiles: React.FC = () => {
    const router = useRouter();
    const {id} = router.query;

    const [files, setFiles] = useState<ChecklistList[]>();
    const canEditUploadStatusRole = ['Admin', 'Auditor'];
    const { data: session } = useSession();
    const role = session?.user?.['role'][0];
    const verseId = router.query['verseId']?.toString() ?? '';

    const isRoleGrantedEditUploadStatus = canEditUploadStatusRole.includes(role) ? true : false;
    const { fetchPUT, fetchGET } = useFetchWithAccessToken();

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: checklistData } = useSWR<ChecklistModel>(GetChecklistList(verseId), swrFetcher);
    const currChecklist = checklistData?.checklistList.find(item => item.id === id);
    const blobList = currChecklist?.blobList ?? [];
    const [tempData, setTempData] = useState<BlobListModel[]>(currChecklist?.blobList ?? []);

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


    useEffect(() => {
        setFiles(checklistData?.checklistList.filter(item => item.id == id))
    }, [checklistData?.checklistList, id]);

    const handleFileUpload = async (index: number) => {
        const fileExt = tempData[index]?.fileName?.split('.').pop();
        const { data } = await fetchGET<ResponseTest>(`${BackendApiUrl.presignedPutObject}?filename=${tempData[index]?.id}.${fileExt}`);
        if (data) {
            await fetch(data.data, {
                method: 'PUT',
                body: tempData[index]?.originFileObj
            });
        }
    }

    const handleSave = async () => {
        if (tempData) {
            for (const [index, value] of tempData.entries()) {
                if (!blobList.includes(value)) {
                    handleFileUpload(index);
                }
            }
            const response = await fetchPUT(BackendApiUrl.saveFile, {
                checklistId: id,
                fileDatas: tempData.map((item) => ({
                    FileId: item.id,
                    FileName: item.fileName,
                    ContentType: item.contentType
                }))
            });
            if (response) {
                mutate(GetChecklistList(verseId));
            }
        }
    }



    const handleChange = (file: RcFile, blobData: BlobListModel[]) => {
        const fileId = uuidv4();

        const newFile = {
            id: fileId,
            fileName: file.name,
            originFileObj: file,
            contentType: file.type,
        };

        setTempData([...blobData, newFile]);
        return tempData.length;
    }

    return (
        <div className='flex flex-1'>
            <div>
                <button onClick={navigateBackToVerse}>
                    <FontAwesomeIcon icon={faCircleLeft} className='text-[#3788FD] mr-5' size={'2x'} />
                </button>
            </div>

            <div className='flex-1'>
                <p className='text-base mb-10' style={{ whiteSpace: 'pre-line' , textAlign: 'justify'}}>
                    {currChecklist?.description}
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
                    <div className="flex items-center space-x-4">
                        {isRoleGrantedEditUploadStatus &&
                            <Upload name='File'
                                beforeUpload={(file) => {
                                    handleChange(file, tempData);
                                    return false;
                                }}
                                defaultFileList={[]}>
                                <CategoryButton text='Upload File' mode='outlined' className='px-8' />
                            </Upload>
                        }
                        <CategoryButton text='Save' className='px-9' style={{ padding: '10px 0' }} onClick={handleSave} />
                    </div>
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
