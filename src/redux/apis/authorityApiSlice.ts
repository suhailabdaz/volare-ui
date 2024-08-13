import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
import { newToken, logout } from '../slices/authoritySlice';
import axios from 'axios';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_GATEWAY_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).AuthorityAuth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('authorityRefreshToken');

    if (!refreshToken) {
      api.dispatch(logout());
      window.location.href = '/authority';
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
      localStorage.setItem('authorityAccessToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('authorityAccessToken', newRefreshToken);
      }

      api.dispatch(newToken({ token: newAccessToken }));

      result = await baseQuery(args, api, extraOptions);
    } catch (refreshError) {
      api.dispatch(logout());
      window.location.href = '/authority';
    }
  }

  return result;
};

export const authorityApi = createApi({
  reducerPath: 'authorityApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Airines'],
  endpoints: (builder) => ({
    getAirlines: builder.query({
      query: (role:string) => ({
        url: '/api/v1/admin/get-users',
        method: 'GET',
        params:{role}
      }),
      providesTags: ['Airines'],
    }),
    blockAirline: builder.mutation({
      query: ({ Id }) => ({
        url: '/api/v1/admin/block-airline',
        method: 'POST',
        body: {Id},
      }),
    }),
    
  }),
})


export const {

  useGetAirlinesQuery,
 useBlockAirlineMutation
} = authorityApi;
export default authorityApi;
