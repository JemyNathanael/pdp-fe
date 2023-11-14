export interface AddNewUserFormProps {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    currentRole:string
}

export interface SelectOptions<T> {
    label: string,
    value: T
}