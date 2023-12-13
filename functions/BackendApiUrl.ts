// Request will be proxied via /api/be/[...apiGateway].ts
const baseUrl = '/api/be';

export const BackendApiUrl = {
    test: baseUrl + '/api/test',
    getRoleList: baseUrl + '/api/Dropdown/role-list',
    getUser: baseUrl + '/api/User',
    editUserRole: baseUrl + '/api/User/edit-user-role',
    logUser: baseUrl + '/api/User/manage-log',
    getCategories: baseUrl + '/api/v1/category/get-category',
    deleteUser: baseUrl + '/api/User',
    getChecklists: baseUrl + '/api/v1/checklist/get-checklist',
    getUploadStatus: baseUrl + '/api/Dropdown/upload-status-list',
    updateChecklistUploadStatus: baseUrl + '/api/v1/checklist/update-upload-status',
    updateChecklist: baseUrl + '/api/v1/Checklist/update-checklist',
    addChecklist: baseUrl + '/api/v1/Checklist',
    deleteChecklist: baseUrl + '/api/v1/Checklist',
    getChecklistDescription: baseUrl + '/api/v1/Checklist/get-description',
    getHomeSearch: baseUrl + '/api/v1/Home',
    getCategorySearch: baseUrl + '/api/v1/Category/search',
    
    createSubCategory: baseUrl + '/api/v1/category',
    updateSubCategory: baseUrl + '/api/v1/category',
    deleteSubCategory: baseUrl + '/api/v1/category',
    getSubCategory: baseUrl + '/api/v1/category',
    getChecklistTitle: baseUrl + '/api/v1/category/get-title',
    getProgress: baseUrl + '/api/v1/category/get-progress',
    getSubCategoryList: baseUrl + '/api/Dropdown/sub-category-list',
    uploadFile: baseUrl + '/api/v1/Blob/upload-file',
    uploadFileInformation: baseUrl + '/api/v1/Blob/upload-file-information',
    presignedPutObject:baseUrl + '/api/v1/Blob/presigned-put-object',
    saveFile:baseUrl + '/api/v1/Checklist/save-file',
    getInformation: baseUrl + '/api/v1/category/get-chapter'
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

export function GetCategoryDetail(categoryId: string) {
    const url = baseUrl + `/api/v1/category/${categoryId}`;

    return url;
}

export function GetChecklistList(verseId: string) {
    const param = new URLSearchParams();

    param.append('verseId', verseId.toString());

    return BackendApiUrl.getChecklists + '?' + param.toString();
}

export function GetChecklistTitle(verseId: string) {
    const param = new URLSearchParams();

    param.append('verseId', verseId.toString());

    return BackendApiUrl.getChecklistTitle + '?' + param.toString();
}

export function GetChecklistDescription(verseId: string) {
    const param = new URLSearchParams();

    param.append('verseId', verseId.toString());

    return BackendApiUrl.getChecklistDescription + '?' + param.toString();
}

export function GetInformation(categoryId : string){
    const param = new URLSearchParams();

    param.append('categoryId',categoryId.toString());

    return BackendApiUrl.getInformation + '?' + param.toString();

}
export function GetProgress(categoryId: string) {
    const param = new URLSearchParams();

    param.append('categoryId', categoryId.toString());

    return BackendApiUrl.getProgress + '?' + param.toString();
}