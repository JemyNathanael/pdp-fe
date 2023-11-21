import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { UUID } from 'crypto';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface EditUserRoleModalProps {
    onCancel: () => void;
    checkId: UUID;
}

interface SuccessModalProps {
    onGoToHome: () => void;
}

interface UpdateChecklist {
    description: string
}


interface UpdateChecklistResponse {
    response: string;
}

const SuccessUpdateModal: React.FC<SuccessModalProps> = ({ onGoToHome }) => {
    console.log("halo")

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 bg-secondary-100 backdrop-filter backdrop-blur-md" onClick={onGoToHome}>
            <div className="flex flex-col p-6 sm:p-12 border items-center justify-center">
                <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#4f7471", fontSize: "64px", marginBottom: "8px" }} />
                <div className="w-full h-4 sm:h-8" />
                <h3 className="text-xl sm:text-2xl text-accent-100 font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Successfully Updated Checklist</h3>
            </div>
        </div>
    );
};

const schema = z.object({
    description: z.string({ required_error: 'Description can\'t be empty' }).min(1, 'Description can\'t be empty'),
});

const UpdateChecklistModal: React.FC<EditUserRoleModalProps> = ({ onCancel, checkId }) => {
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const { fetchPUT } = useFetchWithAccessToken();

    const { handleSubmit, control, formState: { errors } } = useForm<UpdateChecklist>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (formData: UpdateChecklist) => {
        const payload = {
            ...formData,
            id: checkId
        };
        const { data } = await fetchPUT<UpdateChecklistResponse>(BackendApiUrl.updateChecklist, payload);
        console.log(data);
        if (data) {
            console.log("done");
            setSuccessModalVisible(true);
            onCancel();
        }
    };

    const handleSuccessModalClose = () => {
        setSuccessModalVisible(false);
        onCancel();
    };

    const { TextArea } = Input;

    return (
        <>
            <Modal
                open={true}
                centered
                width={750}
                onCancel={onCancel}
                footer={null}
            >
                <h3 className='text-xl sm:text-2xl text-center font-body font-bold mt-6'>Update Checklist</h3>
                <div className='p-5'>
                    <h4 className='text-md sm:text-lg font-body font-bold mb-2 sm:mb-3'>Description</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextArea rows={2}
                                    className='text-slate-500'
                                    {...field}>
                                </TextArea>
                            )}
                        />
                        {errors.description && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.description?.message}</p>
                        )}
                        <div className="flex justify-end mt-5">
                            <button type="submit" className="bg-greyeen text-white rounded font-medium px-5 py-1">Update</button>
                        </div>
                    </form>
                </div>
            </Modal>
            {successModalVisible &&
                (<SuccessUpdateModal onGoToHome={handleSuccessModalClose} />
                )}
        </>

    );
};

export default UpdateChecklistModal;
