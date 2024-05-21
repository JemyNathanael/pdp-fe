import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SelectOptions } from '../interfaces/AddNewUserForms';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { mutate } from 'swr';

interface Props {
    processTypeOptions: SelectOptions<number>[];
    id: number | null,
    name: string,
    processTypeId: number
}

interface AddQuestionTemplate {
    Name: string,
    ProcessTypeId: number
}

const questionSchema = z.object({
    Name: z.string({ required_error: 'Question template name can\'t be empty' }).min(1, 'Question template name can\'t be empty'),
    ProcessTypeId: z.number({ required_error: 'Process Name can\'t be empty' }).min(1, 'Process name can\'t be empty'),
});

const QuestionTemplateForm: React.FC<Props> = ({ processTypeOptions, id, name, processTypeId }) => {
    const { fetchPOST, fetchPUT } = useFetchWithAccessToken();
    const [questionName, setQuestionName] = useState("");
    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm<AddQuestionTemplate>({
        resolver: zodResolver(questionSchema),
    });

    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const onSubmit = async (formData: AddQuestionTemplate) => {
        const payload = {
            ...formData,
        };

        if (id == 0) {
            const response = await fetchPOST<AddQuestionTemplate>(BackendApiUrl.createQuestionTemplate, payload);
            if (response.data) {
                setQuestionName(payload.Name);
                setSuccessModalVisible(true);
                mutate(BackendApiUrl.getQuestionTemplateList);
                reset();
                window.location.reload();
            }
        } else {
            const payloads = {
                id: id,
                ...formData,
            };

            const response = await fetchPUT(BackendApiUrl.updateQuestionTemplate, payloads);
            if (response.data) {
                window.location.reload();
            }
        }
    };

    const onCancel = () => {
        reset();
    }

    useEffect(() => {
        if (id) {
            setValue('Name', name);
            setValue('ProcessTypeId', processTypeId);
        }
    }, [id, name, processTypeId, setValue])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='items-center flex mb-2'>
                <p className='font-bold w-1/5'>Question Template Name</p>
                <div className='w-4/5'>
                    <Controller
                        name="Name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                className={`border-2 rounded mt-2.5 p-3.5`}
                                {...field}
                            />
                        )}
                    />
                    {errors.Name && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.Name?.message}</p>
                    )}
                </div>
            </div>

            <div className='items-center flex' style={{ marginBottom: 90 }}>
                <p className='font-bold w-1/5'>Process Name</p>
                <div className='w-4/5'>
                    <Controller
                        name="ProcessTypeId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className={`mt-3 w-full custom-select h-100 bg-white`}
                                size={"large"}
                                bordered={false}
                                options={processTypeOptions}
                                {...field}
                            />
                        )}
                    />
                    {errors.ProcessTypeId && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.ProcessTypeId?.message}</p>
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
                    <p>Question Template Name {questionName} berhasil dibuat</p>
                </Modal>
            )}
        </form>
    );
};

export default QuestionTemplateForm;
