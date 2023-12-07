import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import PopupAddNewUser from '@/components/manage-user/PopupAddNewUser';
import { AddNewUserFormProps } from '@/components/interfaces/AddNewUserForms';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useRouter } from 'next/router';
import { listCurrentRole } from '@/components/constants';
import { InputAddNewUserForm } from '@/components/common/input/InputAddNewUserForm';
import { InputSelectAddNewUserForm } from '@/components/common/input/InputSelectAddNewUserForm';
import { useController } from 'react-hook-form';
import { SelectOptions } from '@/components/interfaces/AddNewUserForms';
import useSWR from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleXmark} from '@fortawesome/free-regular-svg-icons';

interface DataItem {
    roleName: string;
}

interface AddNewUserFormResponse {
    response: string;
}

interface AddNewUserModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: () => void;
}


const schema = z.object({
    name: z.string({ required_error: 'Name can\'t be empty' }).min(1, 'Name can\'t be empty'),
    email: z.string({ required_error: 'Email can\'t be empty' }).email({ message: 'Email Format not valid' }).min(1, 'Email can\'t be empty'),
    password: z.string({
        required_error: 'Password can\'t be empty'
    })
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-])/, 'Passwords must have uppercase letters, lowercase letters, numbers, and special characters'),
    confirmPassword: z.string({ required_error: 'Confirmation password can\'t be empty' }),
    role: z.string({ required_error: 'Role can\'t be empty' }).min(1, 'Role can\'t be empty'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const AddNewUserModal: React.FC<AddNewUserModalProps> = ({ visible, onCancel, onSave }) => {
    const { replace } = useRouter();
    const { fetchPOST } = useFetchWithAccessToken();
    const [showPopupSuccess, setShowPopupSuccess] = useState(false);
    const { handleSubmit, reset, control, formState: { errors, isValid } } = useForm<AddNewUserFormProps>({
        defaultValues: {
            email: undefined,
            confirmPassword: undefined,
            name: undefined,
            password: undefined,
            role: undefined
        },
        resolver: zodResolver(schema),
        mode: 'onChange',
    });

    const { field: fieldCurrentRole } = useController({ name: 'role', control });

    const swrFetcher = useSwrFetcherWithAccessToken();
    const [roleOptions, setRoleOptions] = useState<SelectOptions<string>[]>([]);

    const { data } = useSWR<DataItem[]>(BackendApiUrl.getRoleList, swrFetcher);


    useEffect(() => {
        const dataSource = () => {
            if (!data) {
                return [];
            }
            const options = data.map((item) => ({
                label: item.roleName,
                value: item.roleName,
            }));

            return options;
        };

        setRoleOptions(dataSource());
    }, [data]);

    const onSubmit = async (formData: AddNewUserFormProps) => {
        if (!isValid) {
            return;
        }

        const payload = {
            ...formData,
        };

        const { data } = await fetchPOST<AddNewUserFormResponse>(BackendApiUrl.getUser, payload);

        if (data) {
            visible = false;
            setShowPopupSuccess(true);
            reset();
            onSave();
        }
    };

    const renderPopupSuccess = () => {
        if (showPopupSuccess) {
            return <PopupAddNewUser onGoToHome={() => {
                setShowPopupSuccess(false)
                replace({
                    pathname: '/ManageUser'
                })
            }} />
        }
        return null;
    }

    const handleCancel = () => {
        onCancel();
    }

    return (
        <>
            <Modal
                open={visible}
                centered
                onCancel={handleCancel}
                footer={null}
                width={800}
                closeIcon={<FontAwesomeIcon icon={faCircleXmark} style={{color: "#3788fd"}} />}
            >
                <div className="flex flex-col px-2 md:px-4 lg:px-8 mt-4 md:mt-16">
                    <h3 className="text-xl sm:text-2xl text-center font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Add New Account</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <InputAddNewUserForm
                                    id={'fullName'}
                                    label='Name'
                                    field={{ ...field }}
                                    placeholder='Insert Name'
                                    formErrorMessage={errors.name?.message}
                                />
                            )} />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <InputAddNewUserForm
                                    id={'email'}
                                    label='Email'
                                    field={{ ...field }}
                                    placeholder='Insert Email'
                                    formErrorMessage={errors.email?.message}
                                />
                            )} />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <InputAddNewUserForm
                                    id={'password'}
                                    label='Password'
                                    field={{ ...field }}
                                    placeholder='Insert Password'
                                    formErrorMessage={errors.password?.message}
                                />
                            )} />

                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <InputAddNewUserForm
                                    id={'confirmPassword'}
                                    label='Confirm Password'
                                    field={{ ...field }}
                                    placeholder='Insert Confirmation Password'
                                    formErrorMessage={errors.confirmPassword?.message}
                                />
                            )} />

                        <InputSelectAddNewUserForm
                            label='Role'
                            value={listCurrentRole.find(e => e.value === fieldCurrentRole.value) ?? ''}
                            name={fieldCurrentRole.name}
                            options={roleOptions}
                            onChange={(selectedOptions: SelectOptions<string>) => fieldCurrentRole.onChange(selectedOptions.value)}
                            placeholder='Choose Role'
                            formErrorMessage={errors?.role?.message}
                        />
                        <div className="col-span-1 text-end">
                            <button
                                className="bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]">
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            {renderPopupSuccess()}
        </>
    );
};
export default AddNewUserModal;