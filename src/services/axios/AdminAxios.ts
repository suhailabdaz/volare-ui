import axios from "axios";
import { API_GATEWAY_BASE_URL } from "../endpoints/AuthorityEndpoints";
import { useDispatch } from "react-redux";
import { logout as authorityLogout,newToken } from "../../redux/slices/adminSlice";

export const createAxios=(dispatch:any)=>{
const adminAxios = axios.create({
    baseURL: API_GATEWAY_BASE_URL,
    headers:{
        "Content-Type":"application/json",
    },
    withCredentials:true,
});
    adminAxios.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('adminAccessToken');
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

    adminAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log(error);
        
        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {    
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('adminRefreshToken');
            console.log("refresh token",refreshToken);
            if (!refreshToken) {
                localStorage.removeItem('adminAccessToken');
                const dispatch=useDispatch()
                dispatch(authorityLogout())
                window.location.href = '/admin';
                return Promise.reject(error);
            }
            try {  
                const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL}/api/v1/auth/refresh`, { token: refreshToken });
                console.log(response,"refresh responbseeyyy");
                const newAccessToken = response.data.token;
                const newRefreshToken = response.data.refreshToken;
                localStorage.setItem('adminAccessToken', newAccessToken);
                dispatch(newToken({ token: newAccessToken }));
                if (newRefreshToken) {
                    localStorage.setItem('adminRefreshToken', newRefreshToken);
                }
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                adminAxios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return adminAxios(originalRequest);
            
            } catch (refreshError) {
                console.log(refreshError)
                localStorage.removeItem('adminAccessToken');
                localStorage.removeItem('adminRefreshToken');
                const dispatch=useDispatch()
                dispatch(authorityLogout())
                window.location.href = '/admin';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    })
    return adminAxios;
}

export default createAxios