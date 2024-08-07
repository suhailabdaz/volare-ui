import axios from "axios";
import { API_GATEWAY_BASE_URL } from "../endpoints/AuthorityEndpoints";
import { useDispatch } from "react-redux";
import { newToken,airlinelogout as authorityLogout } from "../../redux/slices/airlineSlice";

export const createAxios=(dispatch:any)=>{
const airlineAxios = axios.create({
    baseURL: API_GATEWAY_BASE_URL,
    withCredentials:true,
});
    airlineAxios.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('airlineAccessToken');
            return {
                ...config,
                headers: {
                    ...(token !== null && { Authorization: `Bearer ${token}` }),
                    ...config.headers,
                },
            };
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    airlineAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log(error);
        
        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {    
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('airlineRefreshToken');
            console.log("refresh token",refreshToken);
            if (!refreshToken) {
                localStorage.removeItem('airlineAccessToken');
                dispatch(authorityLogout())
                window.location.href = '/airline';
                return Promise.reject(error);
            }
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL}/api/v1/auth/refresh`, { token: refreshToken });
                console.log(response,"refresh responbseeyyy");
                const newAccessToken = response.data.token;
                const newRefreshToken = response.data.refreshToken;
                localStorage.setItem('airlineAccessToken', newAccessToken);
                dispatch(newToken({ token: newAccessToken }));
                if (newRefreshToken) {
                    localStorage.setItem('airlineRefreshToken', newRefreshToken);
                }
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                airlineAxios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return airlineAxios(originalRequest);
            } catch (refreshError) {
                console.log(refreshError)
                localStorage.removeItem('airlineAccessToken');
                localStorage.removeItem('airlineRefreshToken');
                const dispatch=useDispatch()
                dispatch(authorityLogout())
                window.location.href = '/airline';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    })
    return airlineAxios;
}

export default createAxios