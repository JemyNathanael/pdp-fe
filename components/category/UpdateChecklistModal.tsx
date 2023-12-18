import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl, GetChecklistDescription, GetChecklistList } from '@/functions/BackendApiUrl';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mutate } from 'swr';
import { useRouter } from 'next/router';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';

interface EditChecklistModalProps {
    visible: boolean;
    onCancel: () => void;
    checkId: string;
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

interface ChecklistDesc {
    id: string
    checklistDescription: string
}

const SuccessUpdateModal: React.FC<SuccessModalProps> = ({ onGoToHome }) => {
    return (
        <div className="fixed inset-0 flex items-center z-10 justify-center backdrop-filter backdrop-blur-md" onClick={onGoToHome}>
            <div className="flex flex-col p-6 sm:p-12 border items-center justify-center bg-white">
                <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#3788FD", fontSize: "64px", marginBottom: "8px" }} />
                <div className="w-full h-4 sm:h-8" />
                <h3 className="text-xl sm:text-2xl text-accent-100 font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Successfully Updated Checklist</h3>
            </div>
        </div>
    );
};

const schema = z.object({
    description: z.string({ required_error: 'Description can\'t be empty' }).min(1, 'Description can\'t be empty'),
});

const UpdateChecklistModal: React.FC<EditChecklistModalProps> = ({ onCancel, checkId, visible }) => {
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const { fetchPUT } = useFetchWithAccessToken();
    const router = useRouter();
    const verseId = router.query['verseId']?.toString() ?? '';
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: dataDesc } = useSWR<ChecklistDesc>(GetChecklistDescription(checkId), swrFetcher);

    const { handleSubmit, control, formState: { errors } } = useForm<UpdateChecklist>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (formData: UpdateChecklist) => {
        const payload = {
            ...formData,
            id: checkId
        };
        const { data } = await fetchPUT<UpdateChecklistResponse>(BackendApiUrl.updateChecklist, payload);

        if (data) {
            visible = false;
            setSuccessModalVisible(true);
            mutate(GetChecklistList(verseId));
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
                open={visible}
                centered
                width={750}
                onCancel={onCancel}
                footer={null}
                closeIcon={<FontAwesomeIcon icon={faCircleXmark} style={{ color: "#3788fd", fontSize: '24px' }} />}
            >
                <h3 className='text-xl sm:text-2xl text-center font-body font-bold mt-6'>Update Checklist</h3>
                <div className='p-5'>
                    <h4 className='text-md sm:text-lg font-body font-bold mb-2 sm:mb-3'>Description</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextArea 
                                    rows={10}
                                    defaultValue={dataDesc?.checklistDescription}
                                    className='text-slate-500'
                                    {...field}>
                                </TextArea>
                            )}
                        />
                        {errors.description && (
                            <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.description?.message}</p>
                        )}
                        <div className="flex justify-end mt-5">
                            <button type="submit" className="bg-[#3788FD] text-white rounded font-medium px-5 py-1">Update</button>
                        </div>
                    </form>
                </div>
            </Modal>
            {successModalVisible &&
                <SuccessUpdateModal onGoToHome={handleSuccessModalClose} />
            }
        </>

    );
};

export default UpdateChecklistModal;