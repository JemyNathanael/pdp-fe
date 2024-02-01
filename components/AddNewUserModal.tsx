import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import PopupAddNewUser from '@/components/manage-user/PopupAddNewUser';
import { AddNewUserFormProps } from '@/components/interfaces/AddNewUserForms';
import { BackendApiUrl, GetUser } from '@/functions/BackendApiUrl';
import { useRouter } from 'next/router';
import { InputAddNewUserForm } from '@/components/common/input/InputAddNewUserForm';
import { InputSelectAddNewUserForm } from '@/components/common/input/InputSelectAddNewUserForm';
import { useController } from 'react-hook-form';
import { SelectOptions } from '@/components/interfaces/AddNewUserForms';
import useSWR, { mutate } from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Input, Modal, Spin, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

interface DataItem {
    roleName: string;
}

interface AddNewUserModalProps {
    page: number;
    visible: boolean;
    search: string;
    showLoading: () => void;
    hideLoading: () => void;
    onCancel: () => void;
    onSave: () => void;
}

interface FilterData {
    itemsPerPage: number,
    page: number,
    search: string
}


const passwordSchema = z.object({
    password: z.string({
        required_error: 'Password can\'t be empty'
    })
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-])/, 'Passwords must have uppercase letters, lowercase letters, numbers, and special characters'),
    confirmPassword: z.string({ required_error: 'Confirmation password can\'t be empty' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});


const userSchema = z.object({
    name: z.string({ required_error: 'Name can\'t be empty' }).min(1, 'Name can\'t be empty'),
    email: z.string({ required_error: 'Email can\'t be empty' }).email({ message: 'Email Format not valid' }).min(1, 'Email can\'t be empty'),
    role: z.string({ required_error: 'Role can\'t be empty' }).min(1, 'Role can\'t be empty'),
})

const schema = z.intersection(passwordSchema, userSchema);

const AddNewUserModal: React.FC<AddNewUserModalProps> = ({ hideLoading, search, page, visible, onCancel, onSave, showLoading }) => {
    const { replace } = useRouter();
    const [showPopupSuccess, setShowPopupSuccess] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [roleError, setRoleError] = useState('');
    const fetch = useFetchWithAccessToken();
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const { register, setValue, watch, handleSubmit, reset, control, formState: { errors, isValid } } = useForm<AddNewUserFormProps>({
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

    const filter: FilterData = {
        itemsPerPage: 10,
        page: page,
        search: search
    };

    const { field: fieldCurrentRole } = useController({ name: 'role', control });

    const swrFetcher = useSwrFetcherWithAccessToken();
    const [roleOptions, setRoleOptions] = useState<SelectOptions<string>[]>([]);

    const { data } = useSWR<DataItem[]>(BackendApiUrl.getRoleList, swrFetcher);
    const pass = watch('password');
    const confirmPass = watch('confirmPassword');

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

        try {
            showLoading();
            setLoading(true);
            const response = await fetch.fetchPOST(BackendApiUrl.getUser, payload);
            if (response.data?.['success'] === 'Success') {
                setLoading(false);
                visible = false;
                hideLoading();
                setShowPopupSuccess(true);
                reset();
                onSave();
                mutate(GetUser(
                    filter.search,
                    filter.itemsPerPage,
                    filter.page,
                ));
                setTimeout(() => {
                    setShowPopupSuccess(false)
                }, 1500);
                setEmailError('');
                setNameError('');
                setPasswordError('');
                setRoleError('');
                setValue('password', '');
                setValue('confirmPassword', '');
                setPasswordVisible(false);
                setConfirmPasswordVisible(false);
            }
            else {
                setLoading(false);
                hideLoading();
                setEmailError(response.problem?.['errors']['Email']);
                setNameError(response.problem?.['errors']['Name']);
                setPasswordError(response.problem?.['errors']['Password']);
                setRoleError(response.problem?.['errors']['Role']);
            }
        } catch (error) {
            hideLoading();
            setLoading(false);
            notification.error({
                message: 'Error',
                description: 'Something happened in the server',
                duration: 4,
            });
        }
    };

    const handleCancel = () => {
        reset();
        onCancel();
        setValue('password', '');
        setPasswordVisible(false);
        setValue('confirmPassword', '');
        setConfirmPasswordVisible(false);
        setEmailError('');
        setNameError('');
        setPasswordError('');
        setRoleError('');
    }

    const borderClass = () => {
        return errors.password?.message ? 'border-alertdanger' : 'border-secondary-100';
    };

    return (
        <>

            <Modal
                open={visible}
                centered
                onCancel={handleCancel}
                footer={null}
                width={800}
                style={{ maxHeight: '90vh', overflowY: 'auto', position: 'relative', zIndex: 0, }}
                closeIcon={<FontAwesomeIcon icon={faCircleXmark} style={{ color: '#3788fd', fontSize: '24px' }} />}
                maskClosable={false}
            >
                <Spin spinning={loading}>
                    <div className="flex flex-col px-2 py-2 md:px-4 lg:px-8">
                        <h3 className="text-2xl sm:text-3xl text-center font-body font-bold  mb-4 sm:mb-8">Add New Account</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <InputSelectAddNewUserForm
                                label='Role'
                                value={fieldCurrentRole.value}
                                options={roleOptions}
                                onChange={(selectedOptions: SelectOptions<string>) => fieldCurrentRole.onChange(selectedOptions.value)}
                                placeholder='Choose Role'
                                formErrorMessage={errors?.role?.message || roleError}
                            />
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <InputAddNewUserForm
                                        password={passwordVisible}
                                        id={'fullName'}
                                        label='Name'
                                        field={{ ...field }}
                                        placeholder='Insert Name'
                                        formErrorMessage={errors.name?.message || nameError}
                                    />
                                )} />
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <InputAddNewUserForm
                                        password={passwordVisible}
                                        id={'email'}
                                        label='Email'
                                        field={{ ...field }}
                                        placeholder='Insert Email'
                                        formErrorMessage={errors.email?.message || emailError}
                                    />
                                )} />
                            <div className="mb-5 md:mb-8">
                                <label className="text-xl sm:text-2xl font-body font-bold">Password</label>
                                <div className="relative"></div>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={() => (
                                        <Input.Password
                                            className={`border-2 rounded ${borderClass()} w-full mt-2.5 p-3.5`}
                                            placeholder='Insert Password'
                                            {...register('password', { onChange: e => setValue('password', e.target.value) })}
                                            value={pass}
                                            visibilityToggle={{
                                                visible: passwordVisible,
                                                onVisibleChange: (visible) => {
                                                    setPasswordVisible(visible);
                                                }
                                            }}
                                        />
                                    )} />
                                <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.password?.message || passwordError}</p>
                            </div>

                            <div className="mb-5 md:mb-8">
                                <label className="text-xl sm:text-2xl font-body font-bold">Confirm Password</label>
                                <div className="relative"></div>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={() => (
                                        <Input.Password
                                            className={`border-2 rounded ${borderClass()} w-full mt-2.5 p-3.5`}
                                            placeholder='Insert Password'
                                            {...register('confirmPassword', { onChange: e => setValue('confirmPassword', e.target.value) })}
                                            value={confirmPass || ""}
                                            visibilityToggle={{
                                                visible: confirmPasswordVisible,
                                                onVisibleChange: (visible) => {
                                                    setConfirmPasswordVisible(visible);
                                                }
                                            }}
                                        />
                                    )} />
                                <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.confirmPassword?.message || passwordError}</p>
                            </div>

                            <div className="col-span-1 text-end">

                                <button
                                    disabled={!isValid}
                                    className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px] ${!isValid ? 'opacity-50' : ''}`}
                                >
                                    Add
                                </button>

                            </div>
                        </form>
                    </div>
                </Spin>
            </Modal>
            {showPopupSuccess && <PopupAddNewUser onGoToHome={() => {
                replace({
                    pathname: '/ManageUser'
                })
            }} />}
        </>
    );
};
export default AddNewUserModal;