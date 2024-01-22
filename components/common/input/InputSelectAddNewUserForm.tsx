import { SelectOptions } from "@/components/interfaces/AddNewUserForms";
import React from "react";
import { Select } from "antd";

interface InputSelectProps<T> {
    label: string;
    className?: string;
    options: SelectOptions<T>[];
    placeholder?: string;
    value: SelectOptions<T> | string | null;
    onChange: (e) => void;
    formErrorMessage?: string;
}

export const InputSelectAddNewUserForm = <T,>({
    label,
    options,
    placeholder,
    value,
    onChange,
    formErrorMessage,
}: InputSelectProps<T>): React.FunctionComponentElement<T> => {
    return (
        <div className='mb-5 md:mb-8'>
            <label className='text-xl sm:text-2xl text-secondary-100 font-body font-bold mb-5'>{label}</label>
            <Select
                labelInValue={value === null ? false : true}
                options={options}
                placeholder={placeholder}
                className={`mt-3 w-full custom-select h-100`}
                onChange={onChange}
                size={"large"}
                bordered={false}
                value={value ? options.find((opt) => opt.value === value) : undefined}
                getPopupContainer={trigger => trigger.parentNode}
            />
            {formErrorMessage && <p className='text-md text-red-600 font-normal font-body mt-1.5'>{formErrorMessage}</p>}
        </div>
    );
};