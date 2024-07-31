export const API_GATEWAY_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL;


export const airlineEndpoints = {
    register: `${API_GATEWAY_BASE_URL}/api/v1/airline/register`,
    verifyOtp: `${API_GATEWAY_BASE_URL}/api/v1/airline/verify-otp`,
    login: `${API_GATEWAY_BASE_URL}/api/v1/airline/login`,
    getImageLink: `${API_GATEWAY_BASE_URL}/api/v1/airline/get-image`,
    addFlight : `${API_GATEWAY_BASE_URL}/api/v1/airline/add-flight`,
    getFlights : `${API_GATEWAY_BASE_URL}/api/v1/airline/get-flights`,
    suspendFlight : `${API_GATEWAY_BASE_URL}/api/v1/airline/suspend-flight`,
    saveFlight : `${API_GATEWAY_BASE_URL}/api/v1/airline/save-flight`,
}
