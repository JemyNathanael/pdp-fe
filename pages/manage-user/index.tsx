import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType, z } from 'zod';
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

interface DataItem {
    roleName: string;
}

interface AddNewUserFormResponse {
    response: string;
}

const schema: ZodType<AddNewUserFormProps> = z.object({
    fullName: z.string({ required_error: 'Name can\'t be empty' }).min(1, 'Name can\'t be empty'),
    email: z.string({ required_error: 'Email can\'t be empty' }).email({ message: 'Email Format not valid' }).min(1, 'Email tidak boleh kosong'),
    password: z.string({ required_error: 'Password can\'t be empty' }),
    confirmPassword: z.string({ required_error: 'Confirmation password can\'t be empty' }),
    role: z.number({ required_error: 'Role can\'t be empty' }).min(1, 'Role can\'t be empty'),
    currentRole: z.string({ required_error: 'Current Role can\'t be empty' }),
});

const AddNewUserPage: React.FC = () => {
    const { replace } = useRouter();
    const { fetchPOST } = useFetchWithAccessToken();
    const [showPopupSuccess, setShowPopupSuccess] = useState(false);
    const { register, handleSubmit, reset, control, formState: { errors, isValid} } = useForm<AddNewUserFormProps>({
        resolver: zodResolver(schema),
        mode: 'onChange',
    });

    const { field: fieldCurrentRole } = useController({ name: 'currentRole', control });

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
        console.log(1)
        if (!isValid) {
            console.log(2)
            return;
        }

        const payload = {
            ...formData,
        };
        console.log("test", formData)
        const { data } = await fetchPOST<AddNewUserFormResponse>(BackendApiUrl.addNewUser, payload);

        if (data?.response) {
            setShowPopupSuccess(true);
            reset();
        }
    };

    const renderPopupSuccess = () => {
        if (showPopupSuccess) {
            return <PopupAddNewUser onGoToHome={() => {
                setShowPopupSuccess(false)
                replace({
                    pathname: '/'
                })
            }} />
        }
        return null;
    }

    return (
        <Modal
            open={true}
            centered
            footer={[<button key={2} onClick={() => setShowPopupSuccess(true)} className="addButton">Add</button>]}
            width={800}
        >
            <div>
                <div className="flex flex-col px-2 md:px-4 lg:px-8 mt-4 md:mt-16">
                <h3 className="text-xl sm:text-2xl text-center font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Add New Account</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputAddNewUserForm
                        id={'fullName'}
                        label='Name'
                        register={register('fullName', { required: true })}
                        placeholder='Insert Name'
                        formErrorMessage={errors.fullName?.message}
                    />
                    <InputAddNewUserForm
                        id={'email'}
                        label='Email'
                        register={register('email', { required: true })}
                        placeholder='Insert Email'
                        formErrorMessage={errors.email?.message}
                    />
                    <InputAddNewUserForm
                        id={'password'}
                        label='Password'
                        register={register('password', { required: true })}
                        placeholder='Insert Password'
                        formErrorMessage={errors.password?.message}
                    />
                    <InputAddNewUserForm
                        id={'confirmPassword'}
                        label='Confirm Password'
                        register={register('password', { required: true })}
                        placeholder='Insert Confirmation Password'
                        formErrorMessage={errors.confirmPassword?.message}
                    />
                    <InputSelectAddNewUserForm
                        label='Role'
                        value={listCurrentRole.find(e => e.value === fieldCurrentRole.value) ?? ''}
                        name={fieldCurrentRole.name}
                        options={roleOptions}
                        onChange={(selectedOptions: SelectOptions<string>) => fieldCurrentRole.onChange(selectedOptions.value)}
                        placeholder='Choose Role'
                        formErrorMessage={errors?.currentRole?.message}
                    />
                </form>
                {renderPopupSuccess()}
            </div>
            </div>
        </Modal>
    );
};
export default AddNewUserPage;