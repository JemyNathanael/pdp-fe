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
    getSubCategorySearch : baseUrl + '/api/v1/Category/search-second',
    getChecklistSearch: baseUrl + '/api/v1/Checklist/search',
    getChecklistFileSearch: baseUrl + '/api/v1/Checklist/file',
    
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
    getInformation: baseUrl + '/api/v1/category/get-chapter',
    getDownloadFile:baseUrl + '/api/v1/Checklist/get-download-file',

    getProcessTypeList: baseUrl + '/api/Dropdown/process-type-list',
    createQuestionTemplate: baseUrl + '/api/v1/Master',
    getQuestionTemplateList: baseUrl + '/api/v1/Master/question-template',
    deleteQuestionTemplate: baseUrl + '/api/v1/Master/delete-question-template',
    updateQuestionTemplate: baseUrl +'/api/v1/Master/update-question-template', 
    getQuestionTypeList: baseUrl + '/api/Dropdown/question-type-list',
    createQuestion: baseUrl + '/api/v1/Master/question',
    getQuestionList: baseUrl + '/api/v1/Master/question',
    deleteQuestion: baseUrl + '/api/v1/Master/delete-question',
    updateQuestion: baseUrl + '/api/v1/Master/update-question', 
    createUserTemplate: baseUrl + '/api/v1/Master/group-user-template',
    getUserTemplateList: baseUrl + '/api/v1/Master/group-user-template',
    deleteUserTemplateList: baseUrl + '/api/v1/Master/delete-group-user-template',
    updateUserTemplate: baseUrl + '/api/v1/Master/group-user-template',
    getEmailList: baseUrl + '/api/Dropdown/email-list',
    createUsers: baseUrl + '/api/v1/Master/group-user',
    getUsersList: baseUrl + '/api/v1/Master/group-user',
    deleteUsers: baseUrl + '/api/v1/Master/delete-group-user',

    getRopaList: baseUrl + '/api/Ropa/ropa-list',
    getExcelRopa: baseUrl + '/api/Ropa/download-ropa-excel',
    getRopaDetail: baseUrl + '/api/Ropa/detail',
    createRopa: baseUrl + '/api/Ropa/create',
    updateRopa: baseUrl + '/api/Ropa/update',
    deleteRopa: baseUrl + '/api/Ropa/delete',
    getPiaList: baseUrl + '/api/Pia/pia-list',
    getExcelPia: baseUrl + '/api/Pia/download-pia-excel',
    getTriaList: baseUrl + '/api/Tria/tria-list',
    getExcelTria: baseUrl + '/api/Tria/download-tria-excel',
    getIncidentList: baseUrl + '/api/Incident/incident-list',
    getExcelIncident: baseUrl + '/api/Incident/download-incident-excel',
    getDsrList: baseUrl + '/api/Dsr/dsr-list',
    getExcelDsr: baseUrl + '/api/Dsr/download-dsr-excel',
    getPrivacyPolicyList: baseUrl + '/api/PrivacyPolicy/privacy-policy-list',
    getExcelPrivacyPolicy: baseUrl + '/api/PrivacyPolicy/download-privacy-policy-excel',
    downloadPrivacyPolicyImage: baseUrl + '/api/PrivacyPolicy/download-privacy-policy-image',
    getConsentRecordList: baseUrl + '/api/ConsentRecord/consent-record-list',
    getExcelConsentRecord: baseUrl + '/api/ConsentRecord/download-consent-record-excel',
    downloadConsentImage: baseUrl + '/api/ConsentRecord/download-consent-image',
    getDepartments: baseUrl + '/api/Dropdown/departments',
    getIndividualCategories: baseUrl + '/api/Dropdown/individual-categories',
    getPiaStatus: baseUrl + '/api/Dropdown/pia-status',
    getPersonalDataCategories: baseUrl + '/api/Dropdown/personal-data-categories',
    getLawfulBases: baseUrl + '/api/Dropdown/lawful-bases',
    getUsersDropdown: baseUrl + '/api/Dropdown/users',
    getVendorTypesDropdown: baseUrl + '/api/Dropdown/vendor-types',
    getVendorResponsibilityDropdown: baseUrl + '/api/Dropdown/vendor-responsibility',
    getIncidentTypeDropdown: baseUrl + '/api/Dropdown/incident-type',
    createIncident: baseUrl + '/api/Incident',
    getReporterIncidentDropdown: baseUrl + '/api/Dropdown/reporter-incident',
    getPicIncidentDropdown: baseUrl + '/api/Dropdown/pic-incident',
    getRecipientCategoriesDropdown: baseUrl + '/api/Dropdown/recipient-categories',
    getIncidentDetail: baseUrl + '/api/Incident/incident-detail',
    createIncidentInvestigating: baseUrl+ '/api/Incident/incident-investigating',
    createIncidentRemdiation: baseUrl + '/api/Incident/incident-remediation',
    createIncidentReminder: baseUrl + '/api/Incident/incident-reminder',
    createIncidentNotification: baseUrl + '/api/Incident/incident-notification',
    getGroupUserList: baseUrl + '/api/Dropdown/group-user-list',
    getRequestTypeList: baseUrl + '/api/Dropdown/request-type-list',
    getUserNameList: baseUrl + '/api/Dropdown/user-name-list',
    createDsr: baseUrl + '/api/Dsr/create',
    getDsrDetail: baseUrl + '/api/Dsr/detail',
    createAssignPic: baseUrl + '/api/Dsr/create-assign-pic',
    createDsrVerification: baseUrl + '/api/Dsr/create-verification',
    createDsrProgress: baseUrl + '/api/Dsr/create-progress',
    getRequestNameDropdown: baseUrl + '/api/Dropdown/request-name',
    createDsrReminder: baseUrl + '/api/Dsr/create-reminder',
    getDsrReminder: baseUrl + '/api/Dsr/reminder',
    getPolicyTypeDropdown: baseUrl + '/api/Dropdown/policy-type',
    getDataSubjectDropdown: baseUrl + '/api/Dropdown/data-subject-list'
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

export function GetQuestionTemplate(
    questionName: string, 
    processId: string
){
    const param = new URLSearchParams();
    if (questionName !== "") {
        param.append('questionName', questionName);
    }
    if (processId !== "") {
        param.append('processId', processId);
    }
    return BackendApiUrl.getQuestionTemplateList + '?' + param.toString();
}

export function GetQuestion(
    question: string, 
    QuestionTypeId: string,
    id: string,
){
    const param = new URLSearchParams();
    param.append('id', id);
    if (question !== "") {
        param.append('question', question);
    }
    if (QuestionTypeId !== "") {
        param.append('QuestionTypeId', QuestionTypeId);
    }
    return BackendApiUrl.getQuestionList + '?' + param.toString();
}

export function GetUserTemplate(
    groupUserName: string, 
    description: string
){
    const param = new URLSearchParams();
    if (groupUserName !== "") {
        param.append('groupUserName', groupUserName);
    }
    if (description !== "") {
        param.append('description', description);
    }
    return BackendApiUrl.getUserTemplateList + '?' + param.toString();
}

export function GetUsers(
    email: string[] = [],
    id: string
){
    const param = new URLSearchParams();
    param.append('id', id);
    if (email !== undefined) {
        email.forEach(email => {
            param.append('email', email);
        })
    }
    return BackendApiUrl.getUsersList + '?' + param.toString();
}

export function GetRopaList(
    itemsPerPage: number,
    page: number,
    activityName: string,
    departmentId: string,
    dataOwner: string,
    processingPurpose: string,
    personalDataCategoryId: string,
    individualCategoryId: string,
    lawfulBaseId: string
    ) {
    const param = new URLSearchParams();
    if (itemsPerPage !== undefined) {
        param.append("itemsPerPage", itemsPerPage.toLocaleString());
    }
    if (page !== undefined) {
        param.append("page", page.toLocaleString());
    }
    if (activityName !== undefined) {
        param.append('activityName', activityName);
    }
    if (departmentId !== undefined) {
        param.append('departmentId', departmentId);
    }
    if (dataOwner !== undefined) {
        param.append('dataOwner', dataOwner);
    }
    if (processingPurpose !== undefined) {
        param.append('processingPurpose', processingPurpose);
    }
    if (personalDataCategoryId !== undefined) {
        param.append('personalDataCategoryId', personalDataCategoryId);
    }
    if (individualCategoryId !== undefined) {
        param.append('individualCategoryId', individualCategoryId);
    }
    if (lawfulBaseId !== undefined) {
        param.append('lawfulBaseId', lawfulBaseId);
    }
    
    return BackendApiUrl.getRopaList + '?' + param.toString();
}

export function GetExcelRopa(
    activityName: string,
    departmentId: string,
    dataOwner: string,
    processingPurpose: string,
    personalDataCategoryId: string,
    individualCategoryId: string,
    lawfulBaseId: string
    ) {
    const param = new URLSearchParams();
    if (activityName !== undefined) {
        param.append('activityName', activityName);
    }
    if (departmentId !== undefined) {
        param.append('departmentId', departmentId);
    }
    if (dataOwner !== undefined) {
        param.append('dataOwner', dataOwner);
    }
    if (processingPurpose !== undefined) {
        param.append('processingPurpose', processingPurpose);
    }
    if (personalDataCategoryId !== undefined) {
        param.append('personalDataCategoryId', personalDataCategoryId);
    }
    if (individualCategoryId !== undefined) {
        param.append('individualCategoryId', individualCategoryId);
    }
    if (lawfulBaseId !== undefined) {
        param.append('lawfulBaseId', lawfulBaseId);
    }

    return BackendApiUrl.getExcelRopa + '?' + param.toString();
}

export function GetPiaList(
    itemsPerPage: number,
    page: number,
    activityName: string,
    departmentId: string,
    respondenId: string,
    reviewerId: string,
    approverId: string,
    personalDataCategoryId: string,
    piaStatusIds: string[] = [],
    individualCategoryId: string,
    lawfulBaseId: string,
    startDateBegin: string,
    startDateEnded: string,
    endDateBegin: string,
    endDateEnded: string
    ) {
    const param = new URLSearchParams();
    if (itemsPerPage !== undefined) {
        param.append("itemsPerPage", itemsPerPage.toLocaleString());
    }
    if (page !== undefined) {
        param.append("page", page.toLocaleString());
    }
    if (activityName !== undefined) {
        param.append('activityName', activityName);
    }
    if (departmentId !== undefined) {
        param.append('departmentId', departmentId);
    }
    if (respondenId !== undefined) {
        param.append('respondenId', respondenId);
    }
    if (reviewerId !== undefined) {
        param.append('reviewerId', reviewerId);
    }
    if (approverId !== undefined) {
        param.append('approverId', approverId);
    }
    if (piaStatusIds !== undefined) {
        piaStatusIds.forEach(piaStatusId => {
            param.append('piaStatusIds', piaStatusId);
        })
    }
    if (personalDataCategoryId !== undefined) {
        param.append('personalDataCategoryId', personalDataCategoryId);
    }
    if (individualCategoryId !== undefined) {
        param.append('individualCategoryId', individualCategoryId);
    }
    if (lawfulBaseId !== undefined) {
        param.append('lawfulBaseId', lawfulBaseId);
    }
    if (startDateBegin !== undefined) {
        param.append('startDateBegin', startDateBegin);
    }
    if (startDateEnded !== undefined) {
        param.append('startDateEnded', startDateEnded);
    }
    if (endDateBegin !== undefined) {
        param.append('endDateBegin', endDateBegin);
    }
    if (endDateEnded !== undefined) {
        param.append('endDateEnded', endDateEnded);
    }

    return BackendApiUrl.getPiaList + '?' + param.toString();
}

export function GetExcelPia(
    activityName: string,
    departmentId: string,
    respondenId: string,
    reviewerId: string,
    approverId: string,
    personalDataCategoryId: string,
    piaStatusIds: string[] = [],
    individualCategoryId: string,
    lawfulBaseId: string,
    startDateBegin: string,
    startDateEnded: string,
    endDateBegin: string,
    endDateEnded: string
    ) {
    const param = new URLSearchParams();
    if (activityName !== undefined) {
        param.append('activityName', activityName);
    }
    if (departmentId !== undefined) {
        param.append('departmentId', departmentId);
    }
    if (respondenId !== undefined) {
        param.append('respondenId', respondenId);
    }
    if (reviewerId !== undefined) {
        param.append('reviewerId', reviewerId);
    }
    if (approverId !== undefined) {
        param.append('approverId', approverId);
    }
    if (piaStatusIds !== undefined) {
        piaStatusIds.forEach(piaStatusId => {
            param.append('piaStatusIds', piaStatusId);
        })
    }
    if (personalDataCategoryId !== undefined) {
        param.append('personalDataCategoryId', personalDataCategoryId);
    }
    if (individualCategoryId !== undefined) {
        param.append('individualCategoryId', individualCategoryId);
    }
    if (lawfulBaseId !== undefined) {
        param.append('lawfulBaseId', lawfulBaseId);
    }
    if (startDateBegin !== undefined) {
        param.append('startDateBegin', startDateBegin);
    }
    if (startDateEnded !== undefined) {
        param.append('startDateEnded', startDateEnded);
    }
    if (endDateBegin !== undefined) {
        param.append('endDateBegin', endDateBegin);
    }
    if (endDateEnded !== undefined) {
        param.append('endDateEnded', endDateEnded);
    }
    
    return BackendApiUrl.getExcelPia + '?' + param.toString();
}

export function GetTriaList(
    itemsPerPage: number,
    page: number,
    vendorName: string,
    respondenId: string,
    reviewerId: string,
    approverId: string,
    triaStatusIds: string[] = [],
    vendorTypeId: string,
    noSiup: string,
    vendorResponsibility: string
    ) {
    const param = new URLSearchParams();
    if (itemsPerPage !== undefined) {
        param.append("itemsPerPage", itemsPerPage.toLocaleString());
    }
    if (page !== undefined) {
        param.append("page", page.toLocaleString());
    }
    if (vendorName !== undefined) {
        param.append('vendorName', vendorName);
    }
    if (respondenId !== undefined) {
        param.append('respondenId', respondenId);
    }
    if (reviewerId !== undefined) {
        param.append('reviewerId', reviewerId);
    }
    if (approverId !== undefined) {
        param.append('approverId', approverId);
    }
    if (triaStatusIds !== undefined) {
        triaStatusIds.forEach(triaStatusId => {
            param.append('triaStatusIds', triaStatusId);
        })
    }
    if (vendorTypeId !== undefined) {
        param.append('vendorTypeId', vendorTypeId);
    }
    if (noSiup !== undefined) {
        param.append('noSiup', noSiup);
    }
    if (vendorResponsibility !== undefined) {
        param.append('vendorResponsibility', vendorResponsibility);
    }

    return BackendApiUrl.getTriaList + '?' + param.toString();
}

export function GetExcelTria(
    vendorName: string,
    respondenId: string,
    reviewerId: string,
    approverId: string,
    triaStatusIds: string[] = [],
    vendorTypeId: string,
    noSiup: string,
    vendorResponsibility: string
    ) {
    const param = new URLSearchParams();
    if (vendorName !== undefined) {
        param.append('vendorName', vendorName);
    }
    if (respondenId !== undefined) {
        param.append('respondenId', respondenId);
    }
    if (reviewerId !== undefined) {
        param.append('reviewerId', reviewerId);
    }
    if (approverId !== undefined) {
        param.append('approverId', approverId);
    }
    if (triaStatusIds !== undefined) {
        triaStatusIds.forEach(triaStatusId => {
            param.append('triaStatusIds', triaStatusId);
        })
    }
    if (vendorTypeId !== undefined) {
        param.append('vendorTypeId', vendorTypeId);
    }
    if (noSiup !== undefined) {
        param.append('noSiup', noSiup);
    }
    if (vendorResponsibility !== undefined) {
        param.append('vendorResponsibility', vendorResponsibility);
    }
    
    return BackendApiUrl.getExcelTria + '?' + param.toString();
}

export function GetIncidentList(
    itemsPerPage: number,
    page: number,
    incidentTypeId: string,
    reportBy: string,
    incidentStageIds: string[] = [],
    picNameId: string,
    reportDateBegin: string,
    reportDateEnded: string,
    dueDate: string,
    overDue: string,
    incidentDetail: string
    ) {
    const param = new URLSearchParams();
    if (itemsPerPage !== undefined) {
        param.append("itemsPerPage", itemsPerPage.toLocaleString());
    }
    if (page !== undefined) {
        param.append("page", page.toLocaleString());
    }
    if (incidentTypeId !== undefined) {
        param.append('incidentTypeId', incidentTypeId);
    }
    if (reportBy !== undefined) {
        param.append('reportBy', reportBy);
    }
    if (incidentStageIds !== undefined) {
        incidentStageIds.forEach(incidentStageId => {
            param.append('incidentStageIds', incidentStageId);
        })
    }
    if (picNameId !== undefined) {
        param.append('picNameId', picNameId);
    }
    if (reportDateBegin !== undefined) {
        param.append('reportDateBegin', reportDateBegin);
    }
    if (reportDateEnded !== undefined) {
        param.append('reportDateEnded', reportDateEnded);
    }
    if (dueDate !== undefined) {
        param.append('dueDate', dueDate);
    }
    if (overDue !== undefined) {
        param.append('overDue', overDue);
    }
    if (incidentDetail !== undefined) {
        param.append('incidentDetail', incidentDetail);
    }

    return BackendApiUrl.getIncidentList + '?' + param.toString();
}

export function GetExcelIncident(
    incidentTypeId: string,
    reportBy: string,
    incidentStageIds: string[] = [],
    picNameId: string,
    reportDateBegin: string,
    reportDateEnded: string,
    dueDate: string,
    overDue: string,
    incidentDetail: string
    ) {
    const param = new URLSearchParams();
    if (incidentTypeId !== undefined) {
        param.append('incidentTypeId', incidentTypeId);
    }
    if (reportBy !== undefined) {
        param.append('reportBy', reportBy);
    }
    if (incidentStageIds !== undefined) {
        incidentStageIds.forEach(incidentStageId => {
            param.append('incidentStageIds', incidentStageId);
        })
    }
    if (picNameId !== undefined) {
        param.append('picNameId', picNameId);
    }
    if (reportDateBegin !== undefined) {
        param.append('reportDateBegin', reportDateBegin);
    }
    if (reportDateEnded !== undefined) {
        param.append('reportDateEnded', reportDateEnded);
    }
    if (dueDate !== undefined) {
        param.append('dueDate', dueDate);
    }
    if (overDue !== undefined) {
        param.append('overDue', overDue);
    }
    if (incidentDetail !== undefined) {
        param.append('incidentDetail', incidentDetail);
    }
    
    return BackendApiUrl.getExcelIncident + '?' + param.toString();
}

export function GetDsrList(
    itemsPerPage: number,
    page: number,
    requestTypeId: string,
    requesterName: string,
    requestStageIds: string[] = [],
    requestDateBegin: string,
    requestDateEnded: string,
    completionDateBegin: string,
    completionDateEnded: string,
    dueDate: string,
    overDue: string,
    requestDetail: string,
    actionDetail: string
    ) {
    const param = new URLSearchParams();
    if (itemsPerPage !== undefined) {
        param.append("itemsPerPage", itemsPerPage.toLocaleString());
    }
    if (page !== undefined) {
        param.append("page", page.toLocaleString());
    }
    if (requestTypeId !== undefined) {
        param.append('requestTypeId', requestTypeId);
    }
    if (requesterName !== undefined) {
        param.append('requesterName', requesterName);
    }
    if (requestStageIds !== undefined) {
        requestStageIds.forEach(stageId => {
            param.append('requestStageIds', stageId);
        })
    }
    if (requestDateBegin !== undefined) {
        param.append('requestDateBegin', requestDateBegin);
    }
    if (requestDateEnded !== undefined) {
        param.append('requestDateEnded', requestDateEnded);
    }
    if (completionDateBegin !== undefined) {
        param.append('completionDateBegin', completionDateBegin);
    }
    if (completionDateEnded !== undefined) {
        param.append('completionDateEnded', completionDateEnded);
    }
    if (dueDate !== undefined) {
        param.append('dueDate', dueDate);
    }
    if (overDue !== undefined) {
        param.append('overDue', overDue);
    }
    if (requestDetail !== undefined) {
        param.append('requestDetail', requestDetail);
    }
    if (actionDetail !== undefined) {
        param.append('actionDetail', actionDetail);
    }

    return BackendApiUrl.getDsrList + '?' + param.toString();
}

export function GetExcelDsr(
    requestTypeId: string,
    requesterName: string,
    requestStageIds: string[] = [],
    requestDateBegin: string,
    requestDateEnded: string,
    completionDateBegin: string,
    completionDateEnded: string,
    dueDate: string,
    overDue: string,
    requestDetail: string,
    actionDetail: string
    ) {
    const param = new URLSearchParams();
    if (requestTypeId !== undefined) {
        param.append('requestTypeId', requestTypeId);
    }
    if (requesterName !== undefined) {
        param.append('requesterName', requesterName);
    }
    if (requestStageIds !== undefined) {
        requestStageIds.forEach(stageId => {
            param.append('requestStageIds', stageId);
        })
    }
    if (requestDateBegin !== undefined) {
        param.append('requestDateBegin', requestDateBegin);
    }
    if (requestDateEnded !== undefined) {
        param.append('requestDateEnded', requestDateEnded);
    }
    if (completionDateBegin !== undefined) {
        param.append('completionDateBegin', completionDateBegin);
    }
    if (completionDateEnded !== undefined) {
        param.append('completionDateEnded', completionDateEnded);
    }
    if (dueDate !== undefined) {
        param.append('dueDate', dueDate);
    }
    if (overDue !== undefined) {
        param.append('overDue', overDue);
    }
    if (requestDetail !== undefined) {
        param.append('requestDetail', requestDetail);
    }
    if (actionDetail !== undefined) {
        param.append('actionDetail', actionDetail);
    }

    return BackendApiUrl.getExcelDsr + '?' + param.toString();
}

export function GetPrivacyPolicyList(
    itemsPerPage: number,
    page: number,
    policyName: string,
    policyTypeId: string,
    uploadBy: string,
    uploadAtBegin: string,
    uploadAtEnded: string
    ) {
    const param = new URLSearchParams();
    if (itemsPerPage !== undefined) {
        param.append("itemsPerPage", itemsPerPage.toLocaleString());
    }
    if (page !== undefined) {
        param.append("page", page.toLocaleString());
    }
    if (policyName !== undefined) {
        param.append('policyName', policyName);
    }
    if (policyTypeId !== undefined) {
        param.append('policyTypeId', policyTypeId);
    }
    if (uploadAtBegin !== undefined) {
        param.append('uploadAtBegin', uploadAtBegin);
    }
    if (uploadBy !== undefined) {
        param.append('uploadBy', uploadBy);
    }
    if (uploadAtEnded !== undefined) {
        param.append('uploadAtEnded', uploadAtEnded);
    }

    return BackendApiUrl.getPrivacyPolicyList + '?' + param.toString();
}

export function GetExcelPrivacyPolicy(
    policyName: string,
    policyTypeId: string,
    uploadBy: string,
    uploadAtBegin: string,
    uploadAtEnded: string
    ) {
    const param = new URLSearchParams();
    if (policyName !== undefined) {
        param.append('policyName', policyName);
    }
    if (policyTypeId !== undefined) {
        param.append('policyTypeId', policyTypeId);
    }
    if (uploadAtBegin !== undefined) {
        param.append('uploadAtBegin', uploadAtBegin);
    }
    if (uploadBy !== undefined) {
        param.append('uploadBy', uploadBy);
    }
    if (uploadAtEnded !== undefined) {
        param.append('uploadAtEnded', uploadAtEnded);
    }

    return BackendApiUrl.getExcelPrivacyPolicy + '?' + param.toString();
}

export function GetConsentRecordList(
    itemsPerPage: number,
    page: number,
    name: string,
    dataSubjectId: string,
    dob: string,
    uploadBy: string,
    uploadAtBegin: string,
    uploadAtEnded: string
    ) {
    const param = new URLSearchParams();
    if (itemsPerPage !== undefined) {
        param.append("itemsPerPage", itemsPerPage.toLocaleString());
    }
    if (page !== undefined) {
        param.append("page", page.toLocaleString());
    }
    if (name !== undefined) {
        param.append('name', name);
    }
    if (dataSubjectId !== undefined) {
        param.append('dataSubjectId', dataSubjectId);
    }
    if (dob !== undefined) {
        param.append('dob', dob);
    }
    if (uploadBy !== undefined) {
        param.append('uploadBy', uploadBy);
    }
    if (uploadAtBegin !== undefined) {
        param.append('uploadAtBegin', uploadAtBegin);
    }
    if (uploadAtEnded !== undefined) {
        param.append('uploadAtEnded', uploadAtEnded);
    }

    return BackendApiUrl.getConsentRecordList + '?' + param.toString();
}

export function GetExcelConsentRecord(
    name: string,
    dataSubjectId: string,
    dob: string,
    uploadBy: string,
    uploadAtBegin: string,
    uploadAtEnded: string
    ) {
    const param = new URLSearchParams();
    if (name !== undefined) {
        param.append('name', name);
    }
    if (dataSubjectId !== undefined) {
        param.append('dataSubjectId', dataSubjectId);
    }
    if (dob !== undefined) {
        param.append('dob', dob);
    }
    if (uploadBy !== undefined) {
        param.append('uploadBy', uploadBy);
    }
    if (uploadAtBegin !== undefined) {
        param.append('uploadAtBegin', uploadAtBegin);
    }
    if (uploadAtEnded !== undefined) {
        param.append('uploadAtEnded', uploadAtEnded);
    }

    return BackendApiUrl.getExcelConsentRecord + '?' + param.toString();
}