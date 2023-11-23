import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl, GetUser } from '@/functions/BackendApiUrl';
import { mutate } from 'swr';

interface AddChecklistModalProps {
    onCancel: () => void;
    visible: boolean;
    verseId:string | string[] | undefined;
}

interface SuccessModalProps {
    onGoToHome: () => void;
}

interface AddChecklistResponse {
    response: string;
}

const SuccessAddModal: React.FC<SuccessModalProps> = ({ onGoToHome }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 bg-secondary-100 backdrop-filter backdrop-blur-md" onClick={onGoToHome}>
            <div className="flex flex-col p-6 sm:p-12 border items-center justify-center">
                <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#4f7471", fontSize: "64px", marginBottom: "8px" }} />
                <div className="w-full h-4 sm:h-8" />
                <h3 className="text-xl sm:text-2xl text-accent-100 font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Successfully Added Checklist!</h3>
            </div>
        </div>
    );
};

const AddChecklistModal: React.FC<AddChecklistModalProps> = ({ onCancel, visible, verseId }) => {
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const { fetchPOST } = useFetchWithAccessToken();

    const onFinish = async (formData: AddChecklistResponse) => {
        const payload = {
            ...formData,
            VerseId: verseId
        };
        const { data } = await fetchPOST<AddChecklistResponse>(BackendApiUrl.addChecklist, payload);
        if (data) {
            visible = false
            setSuccessModalVisible(true);
            onCancel();
        }
    };

    const handleSuccessModalClose = () => {
        setSuccessModalVisible(false);
        onCancel();
        mutate(GetUser('', 10, 1));
    };

    const { TextArea } = Input;

    return (
        <>
            <Modal
                open={visible}
                centered
                width={750}
                onCancel={onCancel}
                footer={null}
            >
                <h3 className='text-xl sm:text-2xl text-center font-body font-bold mt-6'>Add Checklist</h3>
                <div className='p-5'>
                    <h4 className='text-md sm:text-lg font-body font-bold mb-2 sm:mb-3'>Description</h4>
                    <Form onFinish={onFinish}>
                        <Form.Item label="" name="description">
                            <TextArea rows={2}
                                className='text-slate-500'>
                            </TextArea>
                        </Form.Item>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-greyeen text-white rounded font-medium px-5 py-1">Add</button>
                        </div>
                    </Form>
                </div>
            </Modal>
            {successModalVisible &&
                (<SuccessAddModal onGoToHome={handleSuccessModalClose} />
                )}
        </>

    );
};

export default AddChecklistModal;
