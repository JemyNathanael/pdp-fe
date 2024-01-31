import React, { FC, InputHTMLAttributes } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { Input } from 'antd';

interface InputAddNewUserFormProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    placeholder?: string;
    formErrorMessage?: string;
    field: ControllerRenderProps;
    password: boolean;
}

export const InputAddNewUserForm: FC<InputAddNewUserFormProps> = ({
    id,
    label,
    placeholder,
    formErrorMessage,
    field,
    password
}) => {
    //const [passwordVisible, setPasswordVisible] = React.useState(false);

    const inputType = () => {
        if (id === 'email') return 'email';
        if (id === 'name') return 'text';
        if (id === 'password' || id === 'confirmPassword') {
            return 'password';
        }
        return 'text';
    };

    const borderClass = () => {
        return formErrorMessage ? 'border-alertdanger' : 'border-secondary-100';
    };

    return (
        <div className="mb-5 md:mb-8">
            <label className="text-xl sm:text-2xl font-body font-bold">{label}</label>
            <div className="relative">
                {
                    inputType() == "password" ?
                        <Input.Password
                            className={`border-2 rounded ${borderClass()} w-full mt-2.5 p-3.5`}
                            {...field}
                            placeholder={placeholder}
                            visibilityToggle={{ visible: password }}
                        /> :
                        <Input
                            className={`border-2 rounded ${borderClass()} w-full mt-2.5 p-3.5`}
                            {...field}
                            placeholder={placeholder}
                        />
                }
            </div>
            {formErrorMessage && (
                <p className="text-md text-red-600 font-normal font-body mt-1.5">{formErrorMessage}</p>
            )}
        </div>
    );
};