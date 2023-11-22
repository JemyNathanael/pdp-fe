import React, { useState } from 'react';
import { ConfigProvider, FloatButton } from 'antd';
import AddSubCategoryModal from './AddSubCategoryModal';
import UpdateSubCategoryModal from './UpdateSubCategoryModal';
import DeleteSubCategoryModal from './DeleteSubCategoryModal';
import { faArrowsRotate, faBars, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CategoryVerseFloatingButtonProps {
    categoryId: string
}

export const CategoryVerseFloatingButton: React.FC<CategoryVerseFloatingButtonProps> = ({ categoryId }) => {

    const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = useState(false);
    const [isUpdateSubCategoryModalOpen, setIsUpdateSubCategoryModalOpen] = useState(false);
    const [isDeleteSubCategoryModalOpen, setIsDeleteSubCategoryModalOpen] = useState(false);
    const [backdropVisible, setBackdropVisible] = useState<boolean>(false);

    const handleBackdrop = () => {
        console.log("test");
        setBackdropVisible(!backdropVisible);
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#4F7471"
                }
            }}>

            <div onClick={handleBackdrop}>
                <FloatButton.Group
                    trigger='click'
                    type='primary'
                    style={{ right: 50 }}
                    icon={<FontAwesomeIcon icon={faBars} />}
                >
                    <>
                        <span style={{
                            position: 'absolute',
                            width: '143px',
                            right: '0',
                            top: '6px',
                            fontWeight: 'bolder',
                            color: 'white'
                        }}>
                            Update Pasal
                        </span>
                        <FloatButton type="primary" icon={<FontAwesomeIcon icon={faArrowsRotate} />} onClick={() => setIsUpdateSubCategoryModalOpen(true)} />
                    </>
                    <>
                        <span style={{
                            position: 'absolute',
                            width: '123px',
                            right: '0',
                            top: '62px',
                            fontWeight: 'bolder',
                            color: 'white'
                        }}>
                            Add Pasal
                        </span>
                        <FloatButton type="primary" icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setIsAddSubCategoryModalOpen(true)} />
                    </>
                    <>
                        <span style={{
                            position: 'absolute',
                            width: '100px',
                            right: '0',
                            top: '120px',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            Delete
                        </span>
                        <FloatButton type="primary" icon={<FontAwesomeIcon icon={faMinus} />} onClick={() => setIsDeleteSubCategoryModalOpen(true)} />
                    </>
                </FloatButton.Group>
            </div>

            {backdropVisible && (
                <div
                    className="h-screen w-screen fixed p-0 backdrop-blur bg-black/20" style={{ left: 300, top: 65 }}
                    onClick={handleBackdrop}
                ></div>
            )}

            <AddSubCategoryModal isModalOpen={isAddSubCategoryModalOpen} setIsModalOpen={setIsAddSubCategoryModalOpen} categoryId={categoryId} />
            <UpdateSubCategoryModal isModalOpen={isUpdateSubCategoryModalOpen} setIsModalOpen={setIsUpdateSubCategoryModalOpen} />
            <DeleteSubCategoryModal isModalOpen={isDeleteSubCategoryModalOpen} setIsModalOpen={setIsDeleteSubCategoryModalOpen} />
        </ConfigProvider >
    );
}
