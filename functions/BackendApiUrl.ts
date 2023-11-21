// Request will be proxied via /api/be/[...apiGateway].ts
const baseUrl = '/api/be';

export const BackendApiUrl = {
    test: baseUrl + '/api/test',
    getRoleList: baseUrl + '/api/Dropdown/role-list',
    getUser: baseUrl + '/api/User',

    logUser: baseUrl + '/api/User/manage-log',
    deleteUser: baseUrl + '/api/User',

    editUserRole: baseUrl + '/api/User/edit-user-role',
    getCategories: baseUrl + '/api/v1/category/get-category',
    getChecklists: baseUrl + '/api/v1/category/get-checklist',
    getUploadStatus: baseUrl + '/api/Dropdown/upload-status-list',

    updateChecklist: baseUrl + '/api/v1/Checklist/update-checklist'
}

export function GetUser(
    email: string,
    itemsPerPage: number,
    page: number,
) {
    const param = new URLSearchParams();
    if (email !== undefined) {
        param.append('email', email);
    }

    if (itemsPerPage !== undefined) {
        param.append("itemsPerPage", itemsPerPage.toLocaleString());
    }
    if (page !== undefined) {
        param.append("page", page.toLocaleString());
    }

    return BackendApiUrl.getUser + '?' + param.toString();
}

export function GetLog(
    itemsPerPage: number,
    page: number,
    search: string
) {
    const param = new URLSearchParams();
    if (itemsPerPage !== undefined) {
        param.append("itemsPerPage", itemsPerPage.toLocaleString());
    }
    if (page !== undefined) {
        param.append("page", page.toLocaleString());
    }
    if (search !== undefined) {
        param.append('search', search);
    }
    return BackendApiUrl.logUser + '?' + param.toString();
}

export function GetChecklistList(verseId: string) {
    const param = new URLSearchParams();

    param.append('verseId', verseId.toString());

    return BackendApiUrl.getChecklists + '?' + param.toString();
}