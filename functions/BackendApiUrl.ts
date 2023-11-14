// Request will be proxied via /api/be/[...apiGateway].ts
const baseUrl = '/api/be';

export const BackendApiUrl = {
    test: baseUrl + '/api/test',
    addNewUser: baseUrl + '/api/User',
    editUserRole: baseUrl +' /api/User/edit-user-role',
    getUserDetail: baseUrl + '/api/User/3454746d-cec0-4fbf-ab7b-3fef00f89e79',
    getRoleList: baseUrl + '/api/Dropdown/role-list',
}
