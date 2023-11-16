import React, { FC, InputHTMLAttributes, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface InputAddNewUserFormProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    placeholder?: string;
    formErrorMessage?: string;
    field: ControllerRenderProps;
}

export const InputAddNewUserForm: FC<InputAddNewUserFormProps> = ({
    id,
    label,
    placeholder,
    formErrorMessage,
    field,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password

    const isPasswordType = id === 'password' || id === 'confirmPassword';

    const inputType = () => {
        if (id === 'email') return 'email';
        if (id === 'name') return 'text';
        if (isPasswordType) {
            return isPasswordType && (showPassword || showConfirmPassword) ? 'text' : 'password';
        }
        return 'text';
    };

    const toggleShowPassword = () => {
        if (id === 'password') {
            setShowPassword(!showPassword);
        } else if (id === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const borderClass = () => {
        return formErrorMessage ? 'border-alertdanger' : 'border-secondary-100';
    };

    const autoCompleteValue = isPasswordType ? 'new-password' : 'on';

    return (
        <div className="mb-5 md:mb-8">
            <label className="text-lg text-secondary-100 font-body font-bold">{label}</label>
            <div className="relative">
                <input
                    className={`border-2 rounded ${borderClass()} w-full mt-2.5 p-3.5`}
                    type={inputType()}
                    {...field}
                    placeholder={placeholder}
                    autoComplete={autoCompleteValue}
                />
                {isPasswordType && (
                    <div
                        className="absolute top-1/2 right-4 cursor-pointer transform -translate-y-1/2"
                        onClick={toggleShowPassword}
                    >
                        {showPassword || showConfirmPassword ? (
                            <FontAwesomeIcon icon={faEye} />
                        ) : (
                            <FontAwesomeIcon icon={faEyeSlash} />
                        )}
                    </div>
                )}
            </div>
            {formErrorMessage && (
                <p className="text-md text-red-600 font-normal font-body mt-1.5">{formErrorMessage}</p>
            )}
        </div>
    );
};