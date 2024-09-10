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

const invalidateTagAfterDelay = (tag: any, delay: number) => {
  setTimeout(() => {
    airlineApi.util.invalidateTags([tag]);
  }, delay);
};

export const airlineApi = createApi({
  reducerPath: 'airlineApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['FreeSchedule','mySchedule','submitSchedule','Schedule', 'Airport', 'flight','baggage','refund'],
  endpoints: (builder) => ({
    getFreeSchedules: builder.query({
      query: () => ({
        url: '/api/v1/authority/available-schedules',
        method: 'GET',
      }),
      providesTags: ['Schedule'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('FreeSchedule', 10000);
        } catch {}
      },
    }),
    getAirportDetails: builder.query({
      query: () => ({
        url: '/api/v1/authority/get-airports',
        method: 'GET',
      }),
      providesTags: ['Airport'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('Airport', 10000);
        } catch {}
      },
    }),
    getSchedule: builder.query({
      query: (id) => ({
        url: `/api/v1/authority/get-schedule`,
        method: 'GET',
        params: { id },
      }),
      providesTags: ['Schedule'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('Schedule', 10000);
        } catch {}
      },
    }),
    getBaggagePolicies: builder.query({
      query: (airlineId) => ({
        url: `/api/v1/airline/get-baggages-policies`,
        method: 'GET',
        params: { key:airlineId },
      }),
      providesTags: ['baggage'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('baggage', 10000);
        } catch {}
      },
    }),

    getRefundPolicies: builder.query({
      query: (airlineId) => ({
        url: `/api/v1/airline/get-cancelations-policies`,
        method: 'GET',
        params: { key:airlineId },
      }),
      providesTags: ['refund'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('refund', 10000);
        } catch {}
      },
    }),
    
    getFlights: builder.query({
      query: (airlineId) => ({
        url: `/api/v1/airline/get-flights`,
        method: 'GET',
        params: { key: airlineId },
      }),
      providesTags: ['flight'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('flight', 10000);
        } catch {}
      },
    }),
    submitSchedule: builder.mutation({
      query: (schedule) => ({
        url: '/api/v1/authority/save-schedule',
        method: 'POST',
        body: schedule,
      }),
      invalidatesTags: ['submitSchedule'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('submitSchedule', 10000);
        } catch {}
      },
    }),
    getMySchedules: builder.query({
      query: (id) => ({
        url: `/api/v1/authority/airline-schedules`,
        method: 'GET',
        params: { id },
      }),
      providesTags: ['mySchedule'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('flight', 10000);
        } catch {}
      },
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
  useGetBaggagePoliciesQuery,
  useGetRefundPoliciesQuery
} = airlineApi;
export default airlineApi;
