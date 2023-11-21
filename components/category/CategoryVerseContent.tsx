import { Select } from "antd"
import { CategoryUploadedFileView } from "./CategoryUploadedFileView";
import { CategoryButton } from "./CategoryButton";
import { useRouter } from "next/router";
import { Upload } from 'antd';
import { DefaultOptionType } from "antd/es/select";
import { useEffect, useState } from "react";

interface CategoryVerseContentProps {
    uploadStatus: number;
    title: string;
    blobList: string[];
    checklistIndex: number;
    dropdownOptions: DefaultOptionType[];
    canUpdateStatus: boolean;
    removeFileFromChecklist: (checklistIndex: number, fileIndex: number) => void;
}

export const CategoryVerseContent: React.FC<CategoryVerseContentProps> = ({ uploadStatus, title, blobList, checklistIndex, removeFileFromChecklist, dropdownOptions, canUpdateStatus }) => {
    const router = useRouter();

    const [selectOptions, setSelectOptions] = useState<DefaultOptionType[]>()  

    useEffect(() => {
        setSelectOptions(dropdownOptions)
    }, [dropdownOptions])
    

    function removeFileByIndex(fileIndex: number) {
        removeFileFromChecklist(checklistIndex, fileIndex)
    }

    function navigateToChecklistPage() {
        router.push(router.asPath + '/ChecklistFiles');
    }

    function handleStatusChange(selection) {
        console.log(selection)
    }

    return (
        <div className='flex'>
            <div className='flex flex-col'>
                <Select
                    className='w-52'
                    defaultValue={uploadStatus}
                    options={selectOptions}
                    onChange={(selection) => handleStatusChange(selection)}
                    disabled={!canUpdateStatus}
                />
            </div>

            <div className='flex-1'>
                <div className='flex-1 mx-5'>
                    <div className='text-base'>
                        {title}
                    </div>
                    <div className='flex mt-6'>
                        <div className='flex flex-1'>
                            { blobList.length !== 0 &&
                                blobList.map((file, i) => {
                                    if (i < 3) {
                                        return (
                                            <div className='mr-8' key={i}>
                                                <CategoryUploadedFileView
                                                currentIndex={i} 
                                                filename={file}
                                                removeFileByIndex={() => removeFileByIndex(i)}
                                                />
                                            </div>
                                        )
                                    } else {
                                        return true;
                                    }
                                })
                            }
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex-1'>
                                <Upload>
                                    <CategoryButton text='+ Upload File' mode='outlined' className='px-8'/>
                                </Upload>
                            </div>
                            {
                                blobList.length !== 0 &&
                                <div className='flex flex-row-reverse'>
                                    <button className='text-[#4F7471] underline text-xs font-semibold' onClick={navigateToChecklistPage}>
                                        view all files
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <p className='mx-5 mt-3 text-red-500 text-xs font-semibold'>
                    *Format Files: PDF, PNG, Word, and Excel
                </p>
            </div>
            
        </div>
    )
}