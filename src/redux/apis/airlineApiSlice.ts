import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
import { newToken, airlinelogout } from '../slices/airlineSlice';
import axios from 'axios';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_GATEWAY_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).AirlineAuth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('airlineRefreshToken');

    if (!refreshToken) {
      api.dispatch(airlinelogout());
      window.location.href = '/airline';
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
      localStorage.setItem('airlineAccessToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('airlineRefreshToken', newRefreshToken);
      }

      api.dispatch(newToken({ token: newAccessToken }));

      result = await baseQuery(args, api, extraOptions);
    } catch (refreshError) {
      api.dispatch(airlinelogout());
      window.location.href = '/airline';
    }
  }

  return result;
};

export const airlineApi = createApi({
  reducerPath: 'airlineApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Schedule', 'Airport', 'flight'],
  endpoints: (builder) => ({
    getFreeSchedules: builder.query({
      query: () => ({
        url: '/api/v1/authority/available-schedules',
        method: 'GET',
      }),
      providesTags: ['Schedule'],
    }),
    getAirportDetails: builder.query({
      query: () => ({
        url: '/api/v1/authority/get-airports',
        method: 'GET',
      }),
      providesTags: ['Airport'],
    }),
    getSchedule: builder.query({
      query: (id) => ({
        url: `/api/v1/authority/get-schedule`,
        method: 'GET',
        params: { id },
      }),
      providesTags: ['Schedule'],
    }),
    getFlights: builder.query({
      query: (airlineId) => ({
        url: `/api/v1/airline/get-flights`,
        method: 'GET',
        params: { key: airlineId },
      }),
      providesTags: ['flight'],
    }),
    submitSchedule: builder.mutation({
      query: (schedule) => ({
        url: '/api/v1/authority/save-schedule',
        method: 'POST',
        body: schedule,
      }),
    }),
    getMySchedules: builder.query({
      query: (id) => ({
        url: `/api/v1/authority/airline-schedules`,
        method: 'GET',
        params: { id },
      }),
      providesTags: ['Schedule'],
    }),
  }),
});

export const {
  useGetFreeSchedulesQuery,
  useGetAirportDetailsQuery,
  useGetScheduleQuery,
  useGetFlightsQuery,
  useSubmitScheduleMutation,
  useGetMySchedulesQuery,
} = airlineApi;
export default airlineApi;
