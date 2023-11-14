import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType, z } from 'zod';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import PopupAddNewUser from '@/components/manage-user/PopupAddNewUser';
import { AddNewUserFormProps } from '@/components/interfaces/AddNewUserForms';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { Page } from '@/types/Page';
import { useRouter } from 'next/router';
import { listCurrentRole } from '@/components/constants';
import { WithDefaultLayout } from '@/components/DefautLayout';
import { InputAddNewUserForm } from '@/components/common/input/InputAddNewUserForm';
import { InputSelectAddNewUserForm } from '@/components/common/input/InputSelectAddNewUserForm';
import { useController } from 'react-hook-form';
import { SelectOptions } from '@/components/interfaces/AddNewUserForms';

interface AddNewUserFormResponse {
    response: string;
}

const schema: ZodType<AddNewUserFormProps> = z.object({
    fullName: z.string({ required_error: 'Name can\'t be empty' }).min(1, 'Name can\'t be empty'),
    email: z.string({ required_error: 'Email can\'t be empty' }).email({ message: 'Email Format not valid' }).min(1, 'Email tidak boleh kosong'),
    password: z.string({ required_error: 'Password can\'t be empty' }),
    confirmPassword: z.string({ required_error: 'Confirmation password can\'t be empty' }),
    role: z.number({ required_error: 'Role can\'t be empty' }).min(1, 'Role can\'t be empty'),
    currentRole: z.string({ required_error: 'Current Role can\'t be empty' }), // Add this line
});

const AddNewUserPage: Page = () => {
    const { replace } = useRouter();
    const { fetchPOST } = useFetchWithAccessToken();
    const [showPopupSuccess, setShowPopupSuccess] = useState(false);
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<AddNewUserFormProps>({
        resolver: zodResolver(schema),
    });

    const { field: fieldCurrentRole } = useController({ name: 'currentRole', control });
    const [roleOptions, setRoleOptions] = useState<SelectOptions<string>[]>([]);
    useEffect(() => {
        const fetchRoleList = async () => {
          try {
            const response = await fetch(BackendApiUrl.getRoleList);
            const roleList = await response.json();
            setRoleOptions(roleList);
          } catch (error) {
            console.error('Error fetching role list:', error);
          }
        };
    
        fetchRoleList();
      }, []); 

    // const { data, error, isValidating } = useSWR<DataItem[]>(BackendApiUrl.getRoleList, swrFetcher);

      
    const onSubmit = async (formData: AddNewUserFormProps) => {
        const payload = {
            ...formData,
        };
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
        return null
    }

    return (
        <div className="flex flex-col px-6 md:px-12 lg:px-36 mt-10 md:mt-16">
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
                    id={'password'}
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
            <button onClick={() => setShowPopupSuccess(true)} className="addButton">Add</button>
            {renderPopupSuccess()}
        </div>
    );
};

AddNewUserPage.layout = WithDefaultLayout;
export default AddNewUserPage;
