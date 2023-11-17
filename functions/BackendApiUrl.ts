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
    getChapters: baseUrl + '/api/v1/category',
    createSubCategory: baseUrl + '/api/v1/category',
    updateSubCategory: baseUrl + '/api/v1/category',
    deleteSubCategory: baseUrl + '/api/v1/category',
    getChaptersVerses: baseUrl + '/api/dropdown/chapter-list',

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
