import React, { useState, useRef } from 'react';
//import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { FaFilePdf, FaFileWord, FaFileImage, FaTimes } from 'react-icons/fa';
import { WithDefaultLayout } from '@/components/DefautLayout';
import { ConfigProvider, FloatButton, Menu, Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faBars, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import UpdateChecklistModal from '@/components/UpdateChecklistModal';
import { Authorize } from '@/components/Authorize';
//import { LoadingOverlay } from "@/components/LoadingOverlay";

const ChecklistPage = () => {
    //const [data, setData] = useState([]);
    //const router = useRouter();
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [formData, setFormData] = useState({});

    const [updateModal, setUpdateModal] = useState(false);

    const handleChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
    };

    const data = [
        {
            id: 'guid1',
            description: 'Apakah Anda dapat menunjukkan bahwa subjek data pribadi telah menyetujui pemrosesan data mereka?',
            uploadStatusId: '1',
            blobs: [
                {
                    id: 'guid1',
                    fileName: 'File1.pdf',
                    filePath: '',
                    contentType: 'pdf'
                },
                {
                    id: 'guid1',
                    fileName: 'File2.docx',
                    filePath: '',
                    contentType: 'docx'
                },
                {
                    id: 'guid1',
                    fileName: 'File3.png',
                    filePath: '',
                    contentType: 'image'
                }
            ]
        },
        {
            id: 'guid2',
            description: 'Apakah permintaan persetujuan dapat dibedakan dengan jelas dari hal-hal lain, dengan cara yang dapat dimengerti dan dalam bentuk yang mudah diakses, dan ditulis dalam bahasa yang jelas dan lugas?',
            uploadStatusId: '2',
            blobs: [
                {
                    id: 'guid1',
                    fileName: 'File1.pdf',
                    filePath: '',
                    contentType: 'pdf'
                },
                {
                    id: 'guid1',
                    fileName: 'File2.docx',
                    filePath: '',
                    contentType: 'docx'
                },
                {
                    id: 'guid1',
                    fileName: 'File3.png',
                    filePath: '',
                    contentType: 'image'
                }
            ]
        }
        // Add more rows based on your data
    ];

    const deleteFile = (fileName) => {
        // Implement your delete file logic here
        console.log(`Deleting file: ${fileName}`);
    };

    //const { data, isValidating } = useSwr<ChecklistResponse>(`${BackendApiUrl.getChecklists}?verseId=${getId()}`, swrFetcher);
    const uploadStatusDropdown = useSwr<UploadStatusModel[]>(BackendApiUrl.getUploadStatus, swrFetcher);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = () => {
        if (fileInputRef.current) {
            const files = Array.from(fileInputRef.current.files || []);
            setSelectedFiles(files);
        }
    };

    // function getId() {
    //     const { id } = router.query;

    //     if (!id) {
    //         return '';
    //     }
    //     return id.toString();
    // }

    // if (!data) {
    //     return <LoadingOverlay isLoading={isValidating} />
    // }
    const handleMenuClick = (e) => {
        switch (e.key) {
            case 'update':
                // Implement logic for updating checklist
                setUpdateModal(true);
                console.log('Updating checklist');
                break;
            case 'add':
                // Implement logic for adding checklist
                console.log('Adding checklist');
                break;
            case 'delete':
                // Implement logic for deleting checklist
                console.log('Deleting checklist');
                break;
            default:
                break;
        }
    };

    const settingsMenu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="update">Update Checklist</Menu.Item>
            <Menu.Item key="add">Add Checklist</Menu.Item>
            <Menu.Item key="delete">Delete</Menu.Item>
        </Menu>
    );

    return (
        <Authorize>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#4F7471',
                    }
                }}>
                {updateModal &&
                    <UpdateChecklistModal checkId='a8337eeb-77a2-4159-a7aa-864bae7e0dd9' onCancel={() => setUpdateModal(false)} />
                }
                {data?.map((row) => (
                    <div className='checklistRow' key={row.id}>
                        <div className='checklistRow' key={row.id}>
                            <div className='checklistColumn' style={{ width: '20%' }}>
                                <select defaultValue={row.uploadStatusId} onChange={(e) => handleChange('dropdownField', e.target.value)}>
                                    <option key='0' value=''>
                                        Pilih status..
                                    </option>
                                    {uploadStatusDropdown.data?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='checklistColumn' style={{ width: '60%' }}>
                                <div className='checklistRow'>
                                    <div className="flex items-center justify-between">
                                        <label className='mr-8'>{row.description}</label>
                                        <Dropdown overlay={settingsMenu} placement="bottomRight">
                                            <div style={{ cursor: 'pointer', fontWeight: 'bold', color: 'black' }}>
                                                <FontAwesomeIcon icon={faEllipsisV} />
                                            </div>
                                        </Dropdown>
                                    </div>
                                </div>

                                <div className='checklistRow'>
                                    <div className='checklistColumn' style={{ width: '20%' }}>
                                        <input
                                            type="file"
                                            multiple
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <button className='roundedRectangleBorderButton' onClick={() => fileInputRef.current?.click()}>+ Upload File</button>
                                    </div>
                                </div>
                                <div className='checklistRow'>
                                    {row.blobs.length > 0 && (
                                        <div>
                                            <div className="file-list">
                                                {row.blobs.map((blob) => (
                                                    <div key={blob.id} className="file-item">
                                                        {/* File type icon */}
                                                        <FaTimes className="delete-button" onClick={() => deleteFile(blob.fileName)} />
                                                        {blob.contentType === 'pdf' && <FaFilePdf color="#537372" size={30} />}
                                                        {blob.contentType === 'docx' && <FaFileWord color="#537372" size={30} />}
                                                        {blob.contentType === 'image' && <FaFileImage color="#537372" size={30} />}
                                                        {/* File name */}
                                                        <p>{blob.fileName}</p>
                                                        {/* Delete button */}

                                                    </div>
                                                ))}
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className="file-item">
                                                        {/* File type icon */}
                                                        <FaTimes className="delete-button" onClick={() => deleteFile(file.name)} />
                                                        {file.type === 'pdf' && <FaFilePdf color="#537372" size={30} />}
                                                        {file.type === 'docx' && <FaFileWord color="#537372" size={30} />}
                                                        {file.type === 'image' && <FaFileImage color="#537372" size={30} />}
                                                        {/* File name */}
                                                        <p>{file.name}</p>
                                                        {/* Delete button */}

                                                    </div>
                                                ))}
                                            </div>
                                            {/* <ul>
                                                {selectedFiles.map((file, index) => (
                                                <li key={index}>
                                                    <img
                                                    src={`/icons/${file.type.includes('image') ? 'image' : 'file'}.png`}
                                                    alt="File Icon"
                                                    style={{ width: '20px', height: '20px', marginRight: '5px' }}
                                                    />
                                                    {file.name}
                                                </li>
                                                ))}
                                            </ul> */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
                {/* Add a button to submit the form with formData to your backend */}
                <div className=""></div>
                <FloatButton.Group
                    trigger="click"
                    type="primary"
                    className='m-5'
                    icon={<FontAwesomeIcon icon={faBars} />}
                >
                    <FloatButton type='primary' icon={<FontAwesomeIcon icon={faArrowsRotate} />} tooltip="Update Pasal" />
                    <FloatButton type='primary' icon={<FontAwesomeIcon icon={faPlus} />} tooltip="Add Pasal" />
                    <FloatButton type='primary' icon={<FontAwesomeIcon icon={faMinus} />} tooltip="Delete" />
                </FloatButton.Group>
                {/* <button className='roundedRectangleButton' onClick={() => console.log('Submit:', formData)}>Save</button> */}
            </ConfigProvider>
        </Authorize>
    );
};

ChecklistPage.layout = WithDefaultLayout
export default ChecklistPage;

export interface ChecklistResponse {
    checklistList: ChecklistList[];
    successStatus: boolean;
}

export interface ChecklistList {
    id: uuidv4;
    description: string;
    uploadStatusId: string;
    blobs: BlobList[];
}

export interface BlobList {
    id: uuidv4;
    fileName: string;
    filePath: string;
    contentType: string;
}

export interface UploadStatusModel {
    id: number,
    status: string
}