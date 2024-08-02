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
      const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL}/api/v1/auth/refresh`, {
        token: refreshToken,
      });

      const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem('airlineAccessToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('airlineRefreshToken', newRefreshToken);
      }

      api.dispatch(newToken({ token: newAccessToken }));

      // Retry the original query with the new token
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
  endpoints: (builder) => ({
    getFlights: builder.query({
      query: () => '/api/v1/airline/get-flights',
    }),
    addFlight: builder.mutation({
      query: (flight) => ({
        url: '/api/v1/airline/add-flight',
        method: 'POST',
        body: flight,
      }),
    }),
    // Add more endpoints as needed
  }),
});

export const { useGetFlightsQuery, useAddFlightMutation } = airlineApi;
export default airlineApi;
