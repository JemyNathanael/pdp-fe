// Request will be proxied via /api/be/[...apiGateway].ts
const baseUrl = '/api/be';

export const BackendApiUrl = {
    test: baseUrl + '/api/test',
    getRoleList: baseUrl + '/api/Dropdown/role-list',
    getUser:baseUrl + '/api/User',
    editUserRole: baseUrl + '/api/User/edit-user-role',

}

export function GetUser(
    email: string
) {
    const param = new URLSearchParams();
    if (email !== undefined) {
        param.append('email', email);
    }
    return BackendApiUrl.getUser + '?' + param.toString();
}