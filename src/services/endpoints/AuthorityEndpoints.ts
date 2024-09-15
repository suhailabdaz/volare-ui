export const API_GATEWAY_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL;


export const authorityEndpoints = {
    login : `${API_GATEWAY_BASE_URL}/api/v1/authority/login`,
    addAirport: `${API_GATEWAY_BASE_URL}/api/v1/authority/add-airport`,
    saveAirport:`${API_GATEWAY_BASE_URL}/api/v1/authority/save-airport`,
    deleteAirport:`${API_GATEWAY_BASE_URL}/api/v1/authority/suspend-airport`,
    getAirports:`${API_GATEWAY_BASE_URL}/api/v1/authority/get-airports`,
    addSchedule: `${API_GATEWAY_BASE_URL}/api/v1/authority/add-schedule`,
    getSchedules:`${API_GATEWAY_BASE_URL}/api/v1/authority/get-schedules`,
    suspendSchedule:`${API_GATEWAY_BASE_URL}/api/v1/authority/suspend-schedule`
    
}

