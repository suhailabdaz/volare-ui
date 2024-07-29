export const API_GATEWAY_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL;


export const airlineEndpoints = {
    register: `${API_GATEWAY_BASE_URL}/api/v1/user/register`,
    verifyotp: `${API_GATEWAY_BASE_URL}/api/v1/user/verify-otp`,
    resendOtp: `${API_GATEWAY_BASE_URL}/api/v1/user/resend-otp`,
    login: `${API_GATEWAY_BASE_URL}/api/v1/user/login`,
    logout: `${API_GATEWAY_BASE_URL}/api/v1/user/logout`,
}
