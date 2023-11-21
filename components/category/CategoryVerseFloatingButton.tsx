import React, { useState } from 'react';
import { SyncOutlined, MenuOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import AddSubCategoryModal from './AddSubCategoryModal';
import UpdateSubCategoryModal from './UpdateSubCategoryModal';
import DeleteSubCategoryModal from './DeleteSubCategoryModal';

interface CategoryVerseFloatingButtonProps {
    categoryId: string
}

export const CategoryVerseFloatingButton: React.FC<CategoryVerseFloatingButtonProps> = ({ categoryId }) => {
    
    const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = useState(false);
    const [isUpdateSubCategoryModalOpen, setIsUpdateSubCategoryModalOpen] = useState(false);
    const [isDeleteSubCategoryModalOpen, setIsDeleteSubCategoryModalOpen] = useState(false);

    return (
        <div>
            <FloatButton.Group
                trigger='hover'
                type='primary'
                style={{ right: 50 }}
                icon={<MenuOutlined />}
            >
                <>
                    <span style={{
                        position: 'absolute',
                        width: '200px',
                        right: '0',
                        top: '6px',
                    }}>
                        Update Sub - Category
                    </span>
                    <FloatButton icon={<SyncOutlined />} onClick={() => setIsUpdateSubCategoryModalOpen(true)} />
                </>
                <>
                    <span style={{
                        position: 'absolute',
                        width: '180px',
                        right: '0',
                        top: '62px',
                    }}>
                        Add Sub - Category
                    </span>
                    <FloatButton icon={<PlusOutlined />} onClick={() => setIsAddSubCategoryModalOpen(true)} />
                </>
                <>
                    <span style={{
                        position: 'absolute',
                        width: '100px',
                        right: '0',
                        top: '120px',
                    }}>
                        Delete
                    </span>
                    <FloatButton icon={<MinusOutlined />} onClick={() => setIsDeleteSubCategoryModalOpen(true)} />
                </>
            </FloatButton.Group>

            <AddSubCategoryModal isModalOpen={isAddSubCategoryModalOpen} setIsModalOpen={setIsAddSubCategoryModalOpen} categoryId={categoryId} />
            <UpdateSubCategoryModal isModalOpen={isUpdateSubCategoryModalOpen} setIsModalOpen={setIsUpdateSubCategoryModalOpen} />
            <DeleteSubCategoryModal isModalOpen={isDeleteSubCategoryModalOpen} setIsModalOpen={setIsDeleteSubCategoryModalOpen} />
        </div>    
    );
}
