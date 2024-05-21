import React, { useEffect, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { mutate } from 'swr';

interface AddUserTemplate {
    Id: number | null,
    GroupUserName: string,
    Description: string
}

const questionSchema = z.object({
    GroupUserName: z.string({ required_error: 'Group user name can\'t be empty' }).min(1, 'Group user name can\'t be empty'),
    Description: z.string({ required_error: 'Deskripsi can\'t be empty' }).min(1, 'Deskripsi can\'t be empty'),
});

interface Props {
    id: number | null,
    groupUserName: string,
    description: string
}

const UserTemplateForm: React.FC<Props> = ({ id, groupUserName, description }) => {
    const { fetchPOST, fetchPUT } = useFetchWithAccessToken();
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [groupName, setGroupName] = useState("");
    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm<AddUserTemplate>({
        resolver: zodResolver(questionSchema),
    });

    const onSubmit = async (formData: AddUserTemplate) => {
        const payload = {
            ...formData,
        };

        if (id == 0) {
            const response = await fetchPOST<AddUserTemplate>(BackendApiUrl.createUserTemplate, payload);
            if (response.data) {
                setGroupName(payload.GroupUserName);
                setSuccessModalVisible(true);
                mutate(BackendApiUrl.getUserTemplateList);
                reset();
            }
        } else {
            const payloads = {
                id: id,
                ...formData,
            };

            const { data } = await fetchPUT(BackendApiUrl.updateUserTemplate, payloads);
            if (data) {
                window.location.reload();
            }
        }
    };

    useEffect(() => {
        if (id) {
            setValue('GroupUserName', groupUserName);
            setValue('Description', description);
        }
    }, [id, groupUserName, description, setValue])

    const onCancel = () => {
        reset();
    }

    const { TextArea } = Input;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='items-center flex mb-2'>
                <p className='font-bold w-1/5'>Group User Name</p>
                <div className='w-4/5'>
                    <Controller
                        name="GroupUserName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                className={`border-2 rounded mt-2.5 p-3.5`}
                                {...field}
                            />
                        )}
                    />
                    {errors.GroupUserName && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.GroupUserName?.message}</p>
                    )}
                </div>
            </div>

            <div className='items-center flex' style={{ marginBottom: 90 }}>
                <p className='font-bold w-1/5'>Deskripsi</p>
                <div className='w-4/5'>
                    <Controller
                        name="Description"
                        control={control}
                        render={({ field }) => (
                            <TextArea
                                className={`border-2 rounded mt-1.5 p-3.5 bg-white`}
                                {...field}
                            ></TextArea>
                        )}
                    />
                    {errors.Description && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.Description?.message}</p>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                <hr style={{ margin: '20px 0' }} />
                <div className='flex justify-end px-5 py-3'>
                    <Button type='primary' danger size='large' className='mr-5' onClick={onCancel}>Batal</Button>
                    <button className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]'}`}>Simpan</button>
                </div>
            </div>

            {successModalVisible && (
                <Modal
                    title="Pesan Sukses"
                    visible={successModalVisible}
                    onCancel={() => setSuccessModalVisible(false)}
                    centered
                    footer={false}
                >
                    <p>Group User Name <strong>{groupName}</strong> telah berhasil dibuat</p>
                </Modal>
            )}
        </form>
    );
};

export default UserTemplateForm;
