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
import { Row, Upload, message, notification } from 'antd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { BackendApiUrl, GetChecklistList } from '@/functions/BackendApiUrl';
import { useSession } from 'next-auth/react';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { RcFile, UploadFile } from 'antd/es/upload';



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
    const { id } = router.query;

    const [files, setFiles] = useState<ChecklistList[]>();
    const canEditUploadStatusRole = ['Admin', 'Auditor', 'Uploader'];
    const { data: session } = useSession();
    const role = session?.user?.['role'][0];
    const verseId = router.query['verseId']?.toString() ?? '';
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const isRoleGrantedEditUploadStatus = canEditUploadStatusRole.includes(role) ? true : false;
    const { fetchPUT, fetchGET } = useFetchWithAccessToken();

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: checklistData } = useSWR<ChecklistModel>(GetChecklistList(verseId), swrFetcher);
    const currChecklist = checklistData?.checklistList.find(item => item.id === id);
    const blobList = currChecklist?.blobList ?? [];
    const [tempData, setTempData] = useState<BlobListModel[]>(currChecklist?.blobList ?? []);
    const [isUploading, setIsUploading] = useState<boolean>(true);

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
                setTempData(tempFiles);
                return newChecklist
            })

            setFiles(tempChecklist);
        }
    }

    const isValidFile = file => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'xlx', 'doc', 'xlsx', 'docx'];
        const extension = file.name.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension);
    };

    const onRemove = (file: RcFile) => {
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        setIsUploading(true);
        setFileList(newFileList);
    };

    useEffect(() => {
        setFiles(checklistData?.checklistList.filter(item => item.id == id)),
            setTempData(currChecklist?.blobList ?? []);
    }, [checklistData?.checklistList, id, currChecklist]);

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
                    ContentType: item.contentType,
                })),
            });

            if (response) {
                setFileList([]);
                setTempData([]);
                mutate(GetChecklistList(verseId));
                showSuccessNotification();
                setIsUploading(true);
            }
        }
    };


    const showSuccessNotification = () => {
        notification.success({
            message: 'Success',
            placement: 'bottomRight',
            className: 'custom-success-notification',
            style: {
                backgroundColor: '#3788FD',
                opacity: 0.9,
                color: 'white',
                width: 'fit-content',
                top: '-60px',
            },
            duration: 2,
        });
    };

    const handleChange = (file: RcFile, blobData: BlobListModel[]) => {
        const isDuplicate = tempData.some((item) => item.fileName === file.name);

        if (isDuplicate) {
            const fileNameParts = file.name.split('.');
            const baseName = fileNameParts.slice(0, -1).join('.');
            const extension = fileNameParts[fileNameParts.length - 1];

            let count = 1;
            let newFileName = `${baseName}(${count}).${extension}`;

            while (fileList.some((item) => item.name === newFileName)) {
                count += 1;
                newFileName = `${baseName}(${count}).${extension})`;
            }

            const fileId = uuidv4();

            const newFile = {
                id: fileId,
                fileName: newFileName,
                originFileObj: file,
                contentType: file.type,
            };
            setTempData([...blobData, newFile]);
            return tempData.length;
        }
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
                <p className='text-base mb-10' style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>
                    {currChecklist?.description}
                </p>
                <div className='flex flex-wrap gap-16'>
                    {files &&
                        files.map((file, i) =>
                            file.blobList.map((blob, j) => (
                                <CategoryUploadedFileView
                                    fileId={blob.id}
                                    key={`${i}-${j}`}
                                    currentIndex={i}
                                    filename={blob.fileName}
                                    removeFileByIndex={() => removeFileFromChecklist(i, j)}
                                    canSave={() => setIsUploading(false)}
                                    highlightedBlob={router.query['highlightBlob']?.toString() ?? ''}
                                />
                            ))
                        )
                    }
                </div>

                <div className='flex flex-1 flex-row-reverse mt-24'>
                    <div className="flex items-center space-x-4" >
                        <Row>
                            {isRoleGrantedEditUploadStatus &&
                                <div className='flex-1' style={{ maxWidth: '150px' }}>
                                    <Upload name='File'
                                        fileList={fileList}
                                        onRemove={onRemove}
                                        beforeUpload={(file) => {
                                            if (!isValidFile(file)) {
                                                message.error('You can only upload files with jpg, jpeg, png, pdf, xlx, doc, xlsx, or docx format!');
                                                return false;
                                            }
                                            else {
                                                handleChange(file, tempData);
                                                setIsUploading(false);
                                                setFileList([...fileList, file]);
                                                return false;
                                            }

                                        }}
                                        defaultFileList={[]}>
                                        <CategoryButton disabled={false} text='Upload File' mode='outlined' className='px-8' />
                                    </Upload>
                                </div>
                            }
                            {isRoleGrantedEditUploadStatus &&
                                <CategoryButton disabled={isUploading} text='Save' className='px-9' style={{ padding: '10px 0', maxHeight: '41px', marginLeft: '20px' }} onClick={handleSave} />
                            }
                        </Row>

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
