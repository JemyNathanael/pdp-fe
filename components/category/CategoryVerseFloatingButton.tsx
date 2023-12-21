import React, { useState } from 'react';
import { ConfigProvider, FloatButton } from 'antd';
import AddSubCategoryModal from './AddSubCategoryModal';
import UpdateSubCategoryModal from './UpdateSubCategoryModal';
import DeleteSubCategoryModal from './DeleteSubCategoryModal';
import { faArrowsRotate, faBars, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';

interface CategoryVerseFloatingButtonProps {
    categoryId: string
}

export const CategoryVerseFloatingButton: React.FC<CategoryVerseFloatingButtonProps> = ({ categoryId }) => {

    const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = useState(false);
    const [isUpdateSubCategoryModalOpen, setIsUpdateSubCategoryModalOpen] = useState(false);
    const [isDeleteSubCategoryModalOpen, setIsDeleteSubCategoryModalOpen] = useState(false);
    const [backdropVisible, setBackdropVisible] = useState<boolean>(false);

    const canSeeHamburger = ['Admin', 'Reader'];
    const { data: session } = useSession();
    const role = session?.user?.['role'][0];

    const handleBackdrop = () => {
        setBackdropVisible(!backdropVisible);
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#3788FD"
                }
            }}>

            {canSeeHamburger.includes(role) &&
                <div onClick={handleBackdrop}>
                    <FloatButton.Group
                        trigger='click'
                        type='primary'
                        style={{ right: 50, zIndex: 11 }}
                        icon={<FontAwesomeIcon icon={faBars} />}
                    >
                        <>
                            <span style={{
                                zIndex: 0,
                                position: 'absolute',
                                width: '200px',
                                right: '0',
                                top: '6px',
                                fontWeight: 'bolder',
                                color: 'white'
                            }} 
                            onClick={() => setIsUpdateSubCategoryModalOpen(true)}>
                                Update Sub-Category
                            </span>
                            <FloatButton className='z-[1]' type="primary" icon={<FontAwesomeIcon icon={faArrowsRotate} />} onClick={() => setIsUpdateSubCategoryModalOpen(true)} />
                        </>
                        <>
                            <span style={{
                                zIndex: 0,
                                position: 'absolute',
                                width: '180px',
                                right: '0',
                                top: '62px',
                                fontWeight: 'bolder',
                                color: 'white'
                            }} 
                            onClick={() => setIsAddSubCategoryModalOpen(true)}>
                                Add Sub-Category
                            </span>
                            <FloatButton className='z-[1]'  type="primary" icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setIsAddSubCategoryModalOpen(true)} />
                        </>
                        <>
                            <span style={{
                                zIndex: 0,
                                position: 'absolute',
                                width: '100px',
                                right: '0',
                                top: '120px',
                                fontWeight: 'bold',
                                color: 'white'
                            }} 
                            onClick={() => setIsDeleteSubCategoryModalOpen(true)}>
                                Delete
                            </span>
                            <FloatButton className='z-[1]'  type="primary" icon={<FontAwesomeIcon icon={faMinus} />} onClick={() => setIsDeleteSubCategoryModalOpen(true)} />
                        </>
                    </FloatButton.Group>
                </div>
            }

            {backdropVisible && (
                <div
                    className="h-screen w-screen fixed p-0 backdrop-blur bg-black/20" style={{ left: 300, top: 65 }}
                    onClick={handleBackdrop}
                ></div>
            )}

            <AddSubCategoryModal isModalOpen={isAddSubCategoryModalOpen} setIsModalOpen={setIsAddSubCategoryModalOpen} categoryId={categoryId} />
            <UpdateSubCategoryModal isModalOpen={isUpdateSubCategoryModalOpen} setIsModalOpen={setIsUpdateSubCategoryModalOpen} categoryId={categoryId} />
            <DeleteSubCategoryModal isModalOpen={isDeleteSubCategoryModalOpen} setIsModalOpen={setIsDeleteSubCategoryModalOpen} categoryId={categoryId} />
        </ConfigProvider >
    );
}
