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

const invalidateTagAfterDelay = (tag: any, delay: number) => {
  setTimeout(() => {
    userApi.util.invalidateTags([tag]);
  }, delay);
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['searchAirports','updateBooking','applyCoupon','searchSchedules','searchAirline','searchFlights','searchBooking','usedCoupons','applyCoupon'],
  endpoints: (builder) => ({
    getsearchAirports: builder.query({
      query: () => ({
        url: '/api/v1/authority/get-airports',
        method: 'GET',
      }),
      providesTags: ['searchAirports'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('searchAirports', 10000);
        } catch {}
      },
    }),
    getSearchSchedules: builder.query({
      query:(params: { from: string; to: string; date: string;}) => ({
        url: '/api/v1/authority/search-schedules',
        method: 'GET',
        params,
      }),
      providesTags: ['searchSchedules'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('searchSchedules', 10000);
        } catch {}
      },
    }),
    getsearchAirline: builder.query({
      query: (id:string) => ({
        url: '/api/v1/airline/get-airline',
        method: 'GET',
        params: { id },
      }),
      providesTags: ['searchAirline'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('searchAirline', 30000);
        } catch {}
      },
    }),
    getUsedCoupons: builder.query({
      query: (id:string) => ({
        url: '/api/v1/user/get-used-coupons',
        method: 'GET',
        params: { id },
      }),
      providesTags: ['usedCoupons'],
      async onQueryStarted(_,{ queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('searchAirline', 10000);
        } catch {}
      },
    }),
    getsearchFlight: builder.query({
      query: () => ({
        url: '/api/v1/airline/all-flights',
        method: 'GET',
      }),
      providesTags: ['searchFlights'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('searchFlights', 10000);
        } catch {}
      },
    }),
    initiateBooking: builder.mutation({
      query: (booking) => ({
        url: '/api/v1/booking/initiate-booking',
        method: 'POST',
        body: booking,
      }),
    }),
    getBooking: builder.query({
      query: (id:string) => ({
        url: '/api/v1/booking/get-booking',
        method: 'GET',
        params:{id}
      }),
      providesTags: ['searchBooking'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('searchBooking', 10000);
        } catch {}
      },
    }),
    updateBooking: builder.mutation({
      query: ({ bookingId, travellers,contactDetails }) => ({
        url: `/api/v1/booking/update-booking/${bookingId}`,
        method: 'POST',
        body: {travellers,contactDetails}
      }),
      invalidatesTags: ['updateBooking'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('updateBooking', 10000);
        } catch {}
      },  
    }),
    applyCoupon: builder.mutation({
      query: ({ bookingId, userId, coupon }) => ({
        url: '/api/v1/booking/apply-coupon',
        method: 'POST',
        body: { bookingId, userId, coupon },
      }), 
      invalidatesTags: ['applyCoupon'],
      async onQueryStarted( { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('applyCoupon', 10000);
        } catch {}
      },      
    }),
    getChartedFlight: builder.query({
      query: (id:string) => ({
        url: '/api/v1/authority/get-chartedFlight',
        method: 'GET',
        params:{id}
      }),
    }),

    updateBookingSeats: builder.mutation({
      query: ({ bookingId, seats }) => ({
        url: `/api/v1/booking/update-seats/${bookingId}`,
        method: 'POST',
        body: seats,
      }),
    }),
  }),
  
})


export const {
  
  useGetsearchAirportsQuery,
  useGetSearchSchedulesQuery,
  useGetsearchAirlineQuery,
  useGetUsedCouponsQuery,
  useGetsearchFlightQuery,
  useInitiateBookingMutation,
  useGetBookingQuery,
  useGetChartedFlightQuery,
  useUpdateBookingMutation,
  useUpdateBookingSeatsMutation,
  useApplyCouponMutation
  
} = userApi;
export default userApi;
