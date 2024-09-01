import axios from 'axios';
import { API_GATEWAY_BASE_URL } from '../endpoints/UserEndpoints';
import { newToken, logout as userLogout } from '../../redux/slices/userSlice';

export const createAxios = (dispatch:any) => {
  const userAxios = axios.create({
    baseURL: API_GATEWAY_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
  userAxios.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('accessToken');
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

  userAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log(error);

      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('refresh token', refreshToken);
        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          dispatch(userLogout());
          window.location.href = '/';
          return Promise.reject(error);
        }
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/api/v1/auth/refresh`,
            { token: refreshToken }
          );
          console.log(response, 'refresh responbseeyyy');
          const newAccessToken = response.data.token;
          const newRefreshToken = response.data.refreshToken;
          localStorage.setItem('accessToken', newAccessToken);
          dispatch(newToken({ token: newAccessToken }));
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          userAxios.defaults.headers[
            'Authorization'
          ] = `Bearer ${newAccessToken}`;
          return userAxios(originalRequest);
        } catch (refreshError) {
          console.log(refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch(userLogout());
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
  return userAxios;
};

export default createAxios;
