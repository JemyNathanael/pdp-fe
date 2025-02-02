import { Dropdown, MenuProps, Select, Space, message, notification } from "antd"
import { CategoryUploadedFileView } from "./CategoryUploadedFileView";
import { CategoryButton } from "./CategoryButton";
import { useRouter } from "next/router";
import { Upload } from 'antd';
import { DefaultOptionType } from "antd/es/select";
import { useCallback, useEffect, useState } from "react";
import { CategoryVerseFloatingButton } from "./CategoryVerseFloatingButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import UpdateCheklistModal from "./UpdateChecklistModal";
import AddChecklistModal from "../AddChecklistModal";
import { RcFile, UploadFile } from "antd/es/upload";
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { BackendApiUrl, GetChecklistList } from "@/functions/BackendApiUrl";
import { BlobListModel } from "@/pages/[categoryId]/[chapterId]/[verseId]";
import DeleteChecklistModal from "./DeleteChecklistModal";
import { v4 as uuidv4 } from 'uuid';
import { mutate } from "swr";
import { useSession } from 'next-auth/react';

interface CategoryVerseContentProps {
    checklistId: string,
    uploadStatus: number;
    title: string;
    blobList: BlobListModel[];
    checklistIndex: number;
    checklistLength: number | undefined;
    isSavingVoid: () => void;
    dropdownOptions: DefaultOptionType[];
    canUpdateStatus: boolean;
    removeFileFromChecklist: (checklistIndex: number, fileIndex: number) => void;
    isSaving: boolean;
    canSave: () => void;
    setIsUploading: () => void;
}

interface UpdateUploadStatusModel {
    ChecklistId: string;
    UploadStatusId: number;
}

interface ResponseTest {
    data: string;
}

export const CategoryVerseContent: React.FC<CategoryVerseContentProps> = ({ setIsUploading, isSavingVoid, checklistLength, checklistId, uploadStatus, title, blobList, checklistIndex, removeFileFromChecklist, dropdownOptions, canUpdateStatus, isSaving, canSave }) => {
    const router = useRouter();
    const { fetchPUT, fetchGET } = useFetchWithAccessToken();

    const categoryId = router.query['categoryId']?.toString() ?? '';
    const verseId = router.query['verseId']?.toString() ?? '';

    const [selectOptions, setSelectOptions] = useState<DefaultOptionType[]>();
    const [updateModal, setUpdateModal] = useState(false);
    const [addModal, setAddModal] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [tempData, setTempData] = useState<BlobListModel[]>(blobList);


    const canEditStatusRole = ['Admin', 'Auditor'];
    const canSeeEllipsis = ['Admin', 'Reader'];
    const canSeeDropdown = ['Admin', 'Reader'];
    const { data: session } = useSession();
    const role = session?.user?.['role'][0];
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [notificationMap] = useState<Map<string, boolean>>(new Map());
    const [isEdited, setIsEdited] = useState<boolean>(false);

    const showSuccessNotification = useCallback((checklistId: string) => {
        if (!notificationMap.get(checklistId)) {
            notification.success({
                message: 'Success',
                description: '',
                placement: 'bottomRight',
                className: 'custom-success-notification',
                style: {
                    textAlign: 'center',
                    backgroundColor: '#3788FD',
                    opacity: 0.9,
                    color: 'white',
                    width: 'fit-content',
                    top: '-60px',
                },
                duration: 2
            });
        }
    }, [notificationMap]);

    const handleFileUpload = useCallback(async (index: number) => {
        const fileExt = tempData[index]?.fileName?.split('.').pop();
        const { data } = await fetchGET<ResponseTest>(`${BackendApiUrl.presignedPutObject}?filename=${tempData[index]?.id}.${fileExt}`);
        if (data) {
            await fetch(data.data, {
                method: 'PUT',
                body: tempData[index]?.originFileObj
            });
        }
    }, [tempData, fetchGET])

    const handleSave = useCallback(async () => {
        const response = await fetchPUT(BackendApiUrl.saveFile, {
            checklistId: checklistId,
            fileDatas: tempData.map((item) => ({
                FileId: item.id,
                FileName: item.fileName,
                ContentType: item.contentType,
            })),
        });
        if (response) {
            mutate(GetChecklistList(verseId));
        }
        isSavingVoid();
        setIsUploading();

    }, [fetchPUT, checklistId, tempData, isSavingVoid, setIsUploading, verseId]);

    useEffect(() => {
        if (isSaving) {
            if (tempData) {
                for (const [index, value] of tempData.entries()) {
                    if (!blobList.includes(value)) {
                        handleFileUpload(index);
                    }
                }
                if (fileList.length > 0 || isEdited) {
                    setIsEdited(false);
                    setFileList([]);
                    handleSave();
                    showSuccessNotification(checklistId);
                }
            }
        }
    }, [isSaving, tempData, blobList, handleFileUpload, fileList, isEdited, setIsEdited, setFileList, handleSave, showSuccessNotification, checklistId])


    useEffect(() => {
        setSelectOptions(dropdownOptions);
    }, [dropdownOptions])


    function removeFileByIndex(fileIndex: number) {

        const updatedTempData = tempData.filter((_, index) => index !== fileIndex);

        setTempData(updatedTempData);

        removeFileFromChecklist(checklistIndex, fileIndex);
    }

    function navigateToChecklistPage() {
        const id = checklistId;
        const queryParams = { id: id };
        router.push({
            pathname: `${router.asPath}/ChecklistFiles/`,
            query: queryParams,
        });
    }

    const handleStatusChange = async (uploadStatusId: number) => {
        const payload: UpdateUploadStatusModel = {
            ChecklistId: checklistId,
            UploadStatusId: uploadStatusId,
        };
        await fetchPUT(BackendApiUrl.updateChecklistUploadStatus, payload);
        showSuccessNotification(checklistId);
        mutate(GetChecklistList(verseId));
    };


    const items: MenuProps['items'] = [
        {
            key: 'update',
            label: 'Update Checklist',
            onClick: () => setUpdateModal(true)
        },
        {
            key: 'add',
            label: 'Add Checklist',
            onClick: () => setAddModal(true)
        },
    ]
    if (checklistLength && checklistLength > 1) {
        items.push({
            key: 'delete',
            label: 'Delete',
            onClick: () => setDeleteModal(true)
        });
    }

    const handleCancel = () => {
        setUpdateModal(false);
        setAddModal(false);
        setDeleteModal(false);
    };

    const handleChange = (file: RcFile, blobData: BlobListModel[]) => {
        const isDuplicate = tempData.some((item) => item.fileName === file.name);

        const isFileListDuplicate = fileList.some((item) => item.fileName == file.name);

        if (isDuplicate || isFileListDuplicate) {
            const fileNameParts = file.name.split('.');
            const baseName = fileNameParts.slice(0, -1).join('.');
            const extension = fileNameParts[fileNameParts.length - 1];

            let count = 1;
            let newFileName = `${baseName}(${count}).${extension}`;

            while (tempData.some((item) => item.fileName === newFileName)) {
                count += 1;
                newFileName = `${baseName}(${count}).${extension}`;
            }

            const fileId = uuidv4();

            const newFile = {
                id: fileId,
                fileName: newFileName,
                originFileObj: file,
                contentType: file.type,
            };
            canSave();
            setTempData([...blobData, newFile]);
            setFileList([...fileList, file]);
            return tempData.length;
        }
        const fileId = uuidv4();

        const newFile = {
            id: fileId,
            fileName: file.name,
            originFileObj: file,
            contentType: file.type,
        };
        setFileList([...fileList, file]);
        canSave();
        setTempData([...blobData, newFile]);
        return tempData.length;
    }

    const isValidFile = file => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'xlx', 'doc', 'xlsx', 'docx'];
        const extension = file.name.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension);
    };

    const onRemove = (file: RcFile) => {
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        setFileList(newFileList);
        const updatedData = tempData.filter((item) => item.originFileObj?.uid !== file.uid);
        setTempData(updatedData);
        if(updatedData.length === 0){
            setIsUploading();
        }
    };

    function setCanSave() {
        canSave();
        setIsEdited(true);
    }

    return (
        <>
            {
                deleteModal &&
                <DeleteChecklistModal checkId={checklistId} onCancel={handleCancel} verseId={verseId ? verseId : ''} />
            }

            <UpdateCheklistModal visible={updateModal} checkId={checklistId} onCancel={handleCancel} />
            <AddChecklistModal onCancel={handleCancel} visible={addModal} verseId={verseId} />

            <div className='flex'>
                <div className='flex flex-col'>
                    <Select
                        className='w-52'
                        value={uploadStatus}
                        options={selectOptions}
                        onChange={(selection) => handleStatusChange(selection)}
                        disabled={!canEditStatusRole.includes(role)}
                    />
                </div>

                <div className='flex-1'>
                    <div className='flex-1 mx-5'>
                        <div className='text-base flex items-center'>
                            <Dropdown menu={{ items }} trigger={canSeeDropdown.includes(role) ? ['contextMenu'] : []}>
                                <div className='py-1'>
                                    <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{title}</p>
                                </div>
                            </Dropdown>
                            {canSeeEllipsis.includes(role) &&
                                <div className="flex-1 text-right">
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <div className="cursor-pointer font-bold text-black pl-10">
                                                    <FontAwesomeIcon icon={faEllipsisV} />
                                                </div>
                                            </Space>
                                        </a>
                                    </Dropdown>
                                </div>
                            }
                        </div>
                        <div className='flex mt-6'>
                            <div className='flex flex-1'>
                                {blobList.length !== 0 &&
                                    blobList.map((file, i) => {
                                        if (i < 3) {
                                            return (

                                                <div className='mr-8' key={i}>
                                                    <CategoryUploadedFileView
                                                        fileId={file.id}
                                                        currentIndex={i}
                                                        filename={file.fileName}
                                                        removeFileByIndex={() => removeFileByIndex(i)}
                                                        canSave={() => setCanSave()} highlightedBlob={""} />
                                                </div>
                                            )
                                        } else {
                                            return true;
                                        }
                                    })
                                }
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex-1' style={{ maxWidth: '150px' }}>
                                    {canUpdateStatus &&
                                        <Upload name="File"
                                            fileList={fileList}
                                            onRemove={onRemove}
                                            beforeUpload={(file) => {
                                                if (!isValidFile(file)) {
                                                    message.error('You can only upload files with jpg, jpeg, png, pdf, xlx, doc, xlsx, or docx format!');
                                                    return false;
                                                }
                                                else {
                                                    handleChange(file, tempData);
                                                    return false;
                                                }

                                            }}>
                                            <CategoryButton disabled={false} text='Upload File' mode='outlined' className='px-8 bg-white' />
                                        </Upload>
                                    }

                                </div>
                                {
                                    blobList.length !== 0 &&
                                    <div className='flex flex-row-reverse'>
                                        <button className='text-[#3788FD] underline text-xs font-semibold' onClick={navigateToChecklistPage}>
                                            view all files
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <p className='mx-5 mt-3 text-red-500 text-xs font-semibold'>
                        *Format Files: PDF, PNG, docx, and xlsx
                    </p>
                </div>
                {canUpdateStatus &&
                    <CategoryVerseFloatingButton categoryId={categoryId} />
                }
            </div>
        </>
    )
}