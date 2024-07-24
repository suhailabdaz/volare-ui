export const API_GATEWAY_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL;


export const userEndpoints = {
    checkAccount : `${API_GATEWAY_BASE_URL}/api/v1/user/check-account`,
    register: `${API_GATEWAY_BASE_URL}/api/v1/user/register`,
    verifyotp: `${API_GATEWAY_BASE_URL}/api/v1/user/verify-otp`,
    resendOtp: `${API_GATEWAY_BASE_URL}/api/v1/user/resend-otp`,
    login: `${API_GATEWAY_BASE_URL}/api/v1/user/login`,
    logout: `${API_GATEWAY_BASE_URL}/api/v1/user/logout`,
    google_login: `${API_GATEWAY_BASE_URL}/api/v1/user/google-login`,
    update_password: `${API_GATEWAY_BASE_URL}/api/v1/user/update-password`,
    getUser:`${API_GATEWAY_BASE_URL}/api/v1/user/get-user`,
    updateUser:`${API_GATEWAY_BASE_URL}/api/v1/user/update-user`,
    resetPassword:`${API_GATEWAY_BASE_URL}/api/v1/user/reset-password`,
    addTraveller:`${API_GATEWAY_BASE_URL}/api/v1/user/add-traveller`,
    getTravellers:`${API_GATEWAY_BASE_URL}/api/v1/user/get-travellers`,
    saveTravellers:`${API_GATEWAY_BASE_URL}/api/v1/user/save-travellers`,
    deleteTraveller:`${API_GATEWAY_BASE_URL}/api/v1/user/delete-traveller`
}
