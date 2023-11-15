import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileExcel, faFileImage, faFilePdf, faFileWord, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

interface UploadedFileViewProps {
    filename: string
}

export const CategoryUploadedFileView: React.FC<UploadedFileViewProps> = ({ filename }) => {
    const fileExtension = filename.substring(filename.lastIndexOf('.')+1, filename.length).toLowerCase();
    const icon = extensionToIcon(fileExtension);

    function extensionToIcon(fileExtension: string) {
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
        <div className='bg-white border-[#4F7471] border-[3px] h-[136px] w-[122px] rounded-md flex flex-col relative'>
            <div className='relative mr-[-8px] mt-[-10px]'>
                    <FontAwesomeIcon className='text-white text-[20px] absolute top-0 right-0 ' icon={faCircle} />
                    <FontAwesomeIcon className='text-[#FF0000] text-[20px] absolute top-0 right-0 ' icon={faCircleXmark} />
            </div>
            <div className='flex flex-1 items-center justify-center'>
                <FontAwesomeIcon icon={icon} className='text-[#4F7471]' size={'3x'}/>
            </div>
            <div className='text-xs text-center text-[#4F7471] p-1 border-[#4F7471] border-t-[3px]'>
                {filename}
            </div>
        </div>
    );
}
