import React, { FC, InputHTMLAttributes } from 'react'
import { ControllerRenderProps } from 'react-hook-form'

interface InputAddNewUserForm extends InputHTMLAttributes<HTMLInputElement> {
    id: string
    label: string
    formErrorMessage?: string
    field: ControllerRenderProps
}

export const InputAddNewUserForm: FC<InputAddNewUserForm> = ({ id, label, placeholder, formErrorMessage, field }) => {
    const inputType = () => {
        if (id === 'email') return 'email'
        if (id === 'name') return 'name'
        if (id === 'password') return 'password'
        return 'text'
    }
    const borderClass = () => {
        if (formErrorMessage) {
            return 'border-alertdanger'
        } else {
            return 'border-secondary-100'
        }
    }

    return (
        <div className='mb-5 md:mb-8'>
            <label className='text-lg text-secondary-100 font-body font-bold'>{label}</label>
            <input className={`border-2 rounded ${borderClass()} w-full mt-2.5 p-3.5`} type={inputType()} {...field} placeholder={placeholder} />
            {formErrorMessage && <p className='text-md text-red-600 font-normal font-body mt-1.5'>{formErrorMessage}</p>}
        </div>
    )
}