import { ColorPalette } from "@/components/constants";
import { SelectOptions } from "@/components/interfaces/AddNewUserForms";
import React from "react";
import Select from "react-select";

interface InputSelectProps<T> {
    label: string
    className?: string,
    options: SelectOptions<T>[],
    placeholder?: string,
    value: SelectOptions<T>[] | SelectOptions<T> | string | null,
    onChange: (e) => void,
    name: string
    formErrorMessage?: string
}

export const InputSelectAddNewUserForm = <T,>({
    label,
    options,
    placeholder,
    className,
    value,
    onChange,
    name,
    formErrorMessage
}: InputSelectProps<T>): React.FunctionComponentElement<T> => {

    return (
        <div className='mb-5 md:mb-8'>
            <label className='text-lg text-secondary-100 font-body font-bold mb-5'>{label}</label>
            <Select
                options={options}
                placeholder={placeholder}
                className={`${className}`}
                value={value}
                onChange={onChange}
                name={name}
                styles={{
                    control: (baseTyle) => ({
                        ...baseTyle,
                        borderWidth: 2,
                        borderColor: formErrorMessage ? ColorPalette.alertDanger : ColorPalette.primaryBlack100,
                        padding: 8,
                        marginTop: 10
                    }),
                    dropdownIndicator: (baseStyle) => ({
                        ...baseStyle,
                        color: ColorPalette.primaryBlack100,
                    })
                }}
            />
            {formErrorMessage && <p className='text-md text-alertdanger font-normal font-body mt-1.5'>{formErrorMessage}</p>}
        </div>
    );
};
