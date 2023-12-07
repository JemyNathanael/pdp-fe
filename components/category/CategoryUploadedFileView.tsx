import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileExcel, faFileImage, faFilePdf, faFileWord, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition, faCircle } from '@fortawesome/free-solid-svg-icons';

interface UploadedFileViewProps {
    filename: string;
    currentIndex: number;
    removeFileByIndex: (index: number) => void;
}

export const CategoryUploadedFileView: React.FC<UploadedFileViewProps> = ({ filename, currentIndex, removeFileByIndex }) => {
    const fileExtension = filename.substring(filename.lastIndexOf('.')+1, filename.length).toLowerCase();
    const icon = extensionToIcon(fileExtension);

    function extensionToIcon(fileExtension: string): IconDefinition {
        if (fileExtension === 'pdf') {
            return faFilePdf;
        } else if (fileExtension === 'png') {
            return faFileImage;
        } else if (fileExtension === 'xlx' || fileExtension === 'xlsx') {
            return faFileExcel;
        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
            return faFileWord;
        } else {
            return faFile
        }
    }

    return (
        <div className='bg-white border-[#3788FD] border-[3px] h-[136px] w-[122px] rounded-md flex flex-col relative'>
            <button onClick={() => removeFileByIndex(currentIndex)}>
                <div className='relative mr-[-8px] mt-[-10px]'>
                        <FontAwesomeIcon className='text-white text-[20px] absolute top-0 right-0 ' icon={faCircle} />
                        <FontAwesomeIcon className='text-[#FF0000] text-[20px] absolute top-0 right-0 ' icon={faCircleXmark} />
                </div>
            </button>
            <div className='flex flex-1 items-center justify-center'>
                <FontAwesomeIcon icon={icon} className='text-[#3788FD]' size={'3x'}/>
            </div>
            <div className='text-xs text-center text-[#3788FD] p-1 border-[#3788FD] border-t-[3px]'>
                {filename}
            </div>
        </div>
    );
}
