import React, { useState } from 'react';
import { Button, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

interface AddUser {
    receipentGroupId: number,
    email: string[]
}

interface DropdownModel {
    email: string;
}

const UserForm: React.FC = () => {
    const { fetchPOST } = useFetchWithAccessToken();
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [emailArray, setEmailArray] = useState<string[]>([]);
    const groupUserId = router.query['groupUserId'];

    const handleAddEmail = () => {
        if (selectedEmail && !emailArray.includes(selectedEmail)) {
            setEmailArray(prevState => [...prevState, selectedEmail]);
        }
    };
    const { data: emailList } = useSWR<DropdownModel[]>(BackendApiUrl.getEmailList, swrFetcher);

    const { control, handleSubmit, reset } = useForm<AddUser>();

    const onSubmit = async () => {
        const payload = {
            receipentGroupId: groupUserId,
            userData: emailArray.map(email => ({ Email: email }))
        };

        const response = await fetchPOST<AddUser>(BackendApiUrl.createUsers, payload);
        if (response.data) {
            mutate(BackendApiUrl.createUsers);
        }
    };

    const onCancel = () => {
        reset();
    }

    const handleRemoveOption = (index: number) => {
        const updatedEmails = emailArray.filter((_, i) => i !== index);
        setEmailArray(updatedEmails);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='items-center flex mb-2'>
                <p className='font-bold w-1/5'>Email</p>
                <div className='w-4/5'>
                    <div className='flex flex-row'>
                        <Controller
                            name="email"
                            control={control}
                            render={() => (
                                <Select
                                    showSearch
                                    className={`border-2 rounded mt-2.5 p-3.5 h-100 custom-select bg-white w-5/6`}
                                    bordered={false}
                                    placeholder="Please select"
                                    options={emailList?.map(item => ({
                                        label: item.email,
                                        value: item.email
                                    })) || []}
                                    onChange={(value) => setSelectedEmail(value)}
                                    value={selectedEmail}
                                />
                            )}
                        />
                        <div className='rounded-md ml-3 bg-[#3788FD] w-1/6 items-center flex justify-center cursor-pointer' onClick={handleAddEmail}>
                            <p className='text-center align-middle font-semibold text-white'>Add</p>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        {emailArray.map((email, index) => (
                            <>
                                <p key={index} className="border rounded-md px-5 py-2 mr-3 font-semibold border-[#3788FD] text-md mt-1.5" style={{ color: '#3788FD' }}>
                                    {email}
                                    <FontAwesomeIcon icon={faClose} color='#3788FD' className='ml-3' onClick={() => handleRemoveOption(index)}></FontAwesomeIcon>
                                </p>
                            </>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                <hr style={{ margin: '20px 0' }} />
                <div className='flex justify-end px-5 py-3'>
                    <Button type='primary' danger size='large' className='mr-5' onClick={onCancel}>Batal</Button>
                    <button className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]'}`}>Simpan</button>
                </div>
            </div>
        </form>
    );
};

export default UserForm;
