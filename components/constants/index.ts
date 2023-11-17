import { SelectOptions } from "../interfaces/AddNewUserForms";

export const listCurrentRole: SelectOptions<string>[] = [
    {
        label: 'Admin',
        value: 'Admin',
    },
    {
        label: 'Auditor',
        value: 'Auditor',
    },
    {
        label: 'Uploader',
        value: 'Uploader',
    },
    {
        label: 'Reader',
        value: 'Reader',
    },
]

export const ColorPalette = {
    primaryBlack100: '#1E293B',
    primaryBlack80: '#4B5462',
    primaryBlack60: '#787F89',
    primaryBlack30: '#BCBFC5',
    primaryBlack10: '#E9EAEC',
    primaryGreen100: '#0D9488',
    primaryGreen80: '#3DA9A0',
    primaryGreen60: '#6EBFB8',
    primaryGreen30: '#B7DFDC',
    primaryGreen10: '#E7F5F4',
    primaryWhite: '#F8FAFC',
    alertPrimary: '#1D93FF',
    alertDanger: '#CE3636',
    alertSuccess: '#0D9488',
    alertWarning: '#F5B307',
};