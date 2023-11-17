// Request will be proxied via /api/be/[...apiGateway].ts
const baseUrl = '/api/be';

export const BackendApiUrl = {
    test: baseUrl + '/api/test',
    getCategories: baseUrl + '/api/v1/category/get-category',
    getChecklists: baseUrl + '/api/v1/category/get-checklist'
}

export function GetChecklistList(verseId: string)
{
    const param = new URLSearchParams();
   
    param.append('verseId', verseId.toString());
    
    return BackendApiUrl.getChecklists + '?' + param.toString();
}