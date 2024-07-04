export const API_GATEWAY_BASE_URL = 'http://localhost:4000';


export const userEndpoints = {
    register: `${API_GATEWAY_BASE_URL}/api/v1/user/register`,
    otp: `${API_GATEWAY_BASE_URL}/otp`,
    resendOtp: `${API_GATEWAY_BASE_URL}/resend-otp`,
    login: `${API_GATEWAY_BASE_URL}/api/v1/user/login`,
    logout: `${API_GATEWAY_BASE_URL}/logout`,
}
