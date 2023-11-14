import React, { FC, InputHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface InputAddNewUserForm extends InputHTMLAttributes<HTMLInputElement> {
    id: string
    label: string
    register: UseFormRegisterReturn
    formErrorMessage?: string
}

export const InputAddNewUserForm: FC<InputAddNewUserForm> = ({ id, label, register, placeholder, formErrorMessage }) => {
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
            <input className={`border-2 rounded ${borderClass()} w-full mt-2.5 p-3.5`} type={inputType()} {...register} placeholder={placeholder} />
            {formErrorMessage && <p className='text-md text-alertdanger font-normal font-body mt-1.5'>{formErrorMessage}</p>}
        </div>
    )
}