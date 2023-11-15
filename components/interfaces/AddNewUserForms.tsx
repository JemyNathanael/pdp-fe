export interface AddNewUserFormProps {
    name: string
    email: string
    password: string
    confirmPassword: string | null
    role: string
}

export interface SelectOptions<T> {
    label: string,
    value: T
}