import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
import { newToken, logout } from '../slices/userSlice';
import axios from 'axios';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_GATEWAY_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).UserAuth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      api.dispatch(logout());
      window.location.href = '/';
      return result;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/api/v1/auth/refresh`,
        {
          token: refreshToken,
        }
      );
      const newAccessToken = response.data.token;
      const newRefreshToken = response.data.refreshToken;
      localStorage.setItem('accessToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      api.dispatch(newToken({ token: newAccessToken }));

      result = await baseQuery(args, api, extraOptions);
    } catch (refreshError) {
      api.dispatch(logout());
      window.location.href = '/';
    }
  }

  return result;
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['searchAirports','searchSchedules','searchAirline'],
  endpoints: (builder) => ({
    getsearchAirports: builder.query({
      query: () => ({
        url: '/api/v1/authority/get-airports',
        method: 'GET',
      }),
      providesTags: ['searchAirports'],
    }),
    getSearchSchedules: builder.query({
      query:(params: { from: string; to: string; date: string;}) => ({
        url: '/api/v1/authority/search-schedules',
        method: 'GET',
        params,
      }),
      providesTags: ['searchSchedules'],
      
    }),
    getsearchAirline: builder.query({
      query: (id:string) => ({
        url: '/api/v1/airline/get-airline',
        method: 'GET',
        params: { id },
      }),
      providesTags: ['searchAirline'],
    }),
    getsearchFlight: builder.query({
      query: () => ({
        url: '/api/v1/airline/all-flights',
        method: 'GET',
      }),
      providesTags: ['searchAirline'],
    }),
  }),
  
})


export const {
  
  useGetsearchAirportsQuery,
  useGetSearchSchedulesQuery,
  useGetsearchAirlineQuery,
  useGetsearchFlightQuery
} = userApi;
export default userApi;
