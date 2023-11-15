// Request will be proxied via /api/be/[...apiGateway].ts
const baseUrl = '/api/be';

export const BackendApiUrl = {
    test: baseUrl + '/api/test',
    addNewUser: baseUrl + '/api/User',
    getRoleList: baseUrl + '/api/Dropdown/role-list',
    getUser:baseUrl + '/api/User'

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