import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileExcel, faFileImage, faFilePdf, faFileWord, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition, faCircle } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';

interface UploadedFileViewProps {
    fileId: string;
    filename: string;
    currentIndex: number;
    removeFileByIndex: (index: number) => void;
}
interface ResponseTest {
    data: string;
}

export const CategoryUploadedFileView: React.FC<UploadedFileViewProps> = ({ fileId, filename, currentIndex, removeFileByIndex }) => {
    const MaxFileNameLength = 15;
    const FilenameValidation =
        filename.length > MaxFileNameLength
            ? `${filename.substring(0, MaxFileNameLength - 4)}...${filename.substring(filename.lastIndexOf('.') + 1)}`
            : filename;

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
    const { fetchGET } = useFetchWithAccessToken();

    async function DownloadFile() {
        try {
            const { data } = await fetchGET<ResponseTest>(`${BackendApiUrl.getDownloadFile}?filename=${fileId}.${fileExtension}`);
            if (data) {
                fetch(data.data, {
                    method: 'GET',
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                    .then(blobData => {
                        const url = window.URL.createObjectURL(blobData);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', filename);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    return (
        <div
            className='bg-white border-[#3788FD] border-[3px] h-[136px] w-[122px] rounded-md flex flex-col relative'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                backgroundColor: isHovered ? '#3788FD' : '#FFFFFF',
                border: `3px solid ${isHovered ? '#FFFFFF' : '#3788FD'}`,
                boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'box-shadow 0.3s',
            }}
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
                <Button
                    onClick={DownloadFile}
                    type='link'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {isHovered ? (
                        <DownloadOutlined style={{ fontSize: '45px', color: '#FFFFFF' }} />
                    ) : (
                        <FontAwesomeIcon
                            icon={icon}
                            className='text-[#3788FD]'
                            size={'3x'}
                        />
                    )}
                </Button>
            </div>
            {!isHovered ? (
                <div className='text-xs text-center text-[#3788FD] p-1 border-[#3788FD] border-t-[3px]'>
                    <button onClick={DownloadFile}>
                        {FilenameValidation}
                    </button>
                </div>
            ) : (
                <div className='text-xs text-center text-[#FFFFFF] p-1 border-[#FFFFFF] border-t-[3px]'>
                    <button
                        onClick={DownloadFile}
                        style={{
                            borderColor: '#3788FD',
                            padding: '4px',
                            borderRadius: '5px',
                            color: isHovered ? '#FFFFFF' : '#3788FD',
                            cursor: 'pointer',
                        }}
                    >
                        {FilenameValidation}
                    </button>
                </div>
            )}
        </div>
    );
}
