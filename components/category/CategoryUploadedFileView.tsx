import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileExcel, faFileImage, faFilePdf, faFileWord, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition, faCircle } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { Popover, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface UploadedFileViewProps {
    filename: string;
    currentIndex: number;
    removeFileByIndex: (index: number) => void;
}

export const CategoryUploadedFileView: React.FC<UploadedFileViewProps> = ({ filename, currentIndex, removeFileByIndex }) => {
    const fileExtension = filename.substring(filename.lastIndexOf('.') + 1, filename.length).toLowerCase();
    const icon = extensionToIcon(fileExtension);
    const [isHovered, setIsHovered] = useState(false);

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

    const canEditUploadStatusRole = ['Admin', 'Auditor', 'Uploader'];
    const { data: session } = useSession();
    const role = session?.user?.['role'][0];

    return (
        <div
            className='bg-white border-[#3788FD] border-[3px] h-[136px] w-[122px] rounded-md flex flex-col relative'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {!canEditUploadStatusRole.includes(role) ? true :
                <button onClick={() => removeFileByIndex(currentIndex)}>
                    <div className='relative mr-[-8px] mt-[-10px]'>
                        <FontAwesomeIcon className='text-white text-[20px] absolute top-0 right-0 ' icon={faCircle} />
                        <FontAwesomeIcon className='text-[#FF0000] text-[20px] absolute top-0 right-0 ' icon={faCircleXmark} />
                    </div>
                </button>
            }
            <div className='flex flex-1 items-center justify-center'>
                <Popover content='Download'>
                    <Button
                        type='link'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {isHovered ? (
                            <DownloadOutlined style={{ fontSize: '45px' }}/>
                        ) : (
                            <FontAwesomeIcon
                                icon={icon}
                                className='text-[#3788FD]'
                                size={'3x'}
                            />
                        )}
                    </Button>
                </Popover>
            </div>
            <div className='text-xs text-center text-[#3788FD] p-1 border-[#3788FD] border-t-[3px]'>
                {filename}
            </div>
        </div>
    );
}
