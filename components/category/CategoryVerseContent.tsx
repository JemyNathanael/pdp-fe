import { Select } from "antd"
import { CategoryUploadedFileView } from "./CategoryUploadedFileView";
import { CategoryButton } from "./CategoryButton";
import { useRouter } from "next/router";
import { Upload } from 'antd';

interface selectType {
    value: string;
    label: string;
}

interface CategoryVerseContentProps {
    status: 'Sesuai Sepenuhnya' | 'Sesuai Sebagian' | 'Tidak Sesuai' | 'Tidak Dapat Diterapkan';
    title: string;
    uploadedFiles?: string[];
    checklistIndex: number
    removeFileFromChecklist: (checklistIndex: number, fileIndex: number) => void
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

export const CategoryVerseContent: React.FC<CategoryVerseContentProps> = ({ status, title, uploadedFiles, checklistIndex, removeFileFromChecklist }) => {
    const router = useRouter();

    function removeFileByIndex(fileIndex: number) {
        removeFileFromChecklist(checklistIndex, fileIndex)
    }

    function navigateToChecklistPage() {
        router.push(router.asPath + '/ChecklistFiles');
    }

    return (
        <div className='flex'>
            <div className='flex flex-col'>
                <Select
                    className='w-52'
                    defaultValue={status}
                    options={selectOptions} 
                />
            </div>

            <div className='flex-1'>
                <div className='flex-1 mx-5'>
                    <div className='text-base'>
                        {title}
                    </div>
                    <div className='flex mt-6'>
                        <div className='flex flex-1'>
                            { uploadedFiles &&
                                uploadedFiles.map((file, i) => {
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
                                uploadedFiles &&
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