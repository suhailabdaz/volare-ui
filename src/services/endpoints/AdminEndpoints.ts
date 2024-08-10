export const API_GATEWAY_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL;


export const adminEndpoints = {
    login: `${API_GATEWAY_BASE_URL}/api/v1/admin/login`,
    logout: `${API_GATEWAY_BASE_URL}/api/v1/admin/logout`,
    getUsers:`${API_GATEWAY_BASE_URL}/api/v1/admin/get-users`,
    blockUser:`${API_GATEWAY_BASE_URL}/api/v1/admin/block-user`,
}
