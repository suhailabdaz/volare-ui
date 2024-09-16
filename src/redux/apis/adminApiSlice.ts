import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
import { newToken,logout  } from '../slices/adminSlice';
import axios from 'axios';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_GATEWAY_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).AdminAuth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('adminRefreshToken');

    if (!refreshToken) {
      api.dispatch(logout());
      window.location.href = '/admin';
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
      localStorage.setItem('adminAccessToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('adminRefreshToken', newRefreshToken);
      }
      api.dispatch(newToken({ token: newAccessToken }));

      result = await baseQuery(args, api, extraOptions);
    } catch (refreshError) {
      api.dispatch(logout());
      window.location.href = '/admin';
    }
  }

  return result;
};

const invalidateTagAfterDelay = (tag: any, delay: number) => {
  setTimeout(() => {
    adminApi.util.invalidateTags([tag]);
  }, delay);
};

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Coupons','Banners'],
  endpoints: (builder) => ({
    createCoupon: builder.mutation({
      query: (coupon) => ({
        url: '/api/v1/admin/create-coupon',
        method: 'POST',
        body: coupon,
      }),
    }),
    getCoupons: builder.query({
      query: () => ({
        url: '/api/v1/admin/get-coupons',
        method: 'GET',
      }),
      providesTags: ['Coupons'],
      async onQueryStarted( _,{ queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('Coupons', 10000);
        } catch {}
      },
    }),
    createBanner: builder.mutation({
      query: (banner) => ({
        url: '/api/v1/admin/create-banner',
        method: 'POST',
        body: banner,
      }),
    }),
    getBanners: builder.query({
      query: () => ({
        url: '/api/v1/admin/get-banners',
        method: 'GET',
      }),
      providesTags: ['Banners'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTagAfterDelay('Banners', 10000);
        } catch {}
      },
    }),
    blockBanOrCoup: builder.mutation({
      query: ({ id, type }) => ({
        url: '/api/v1/admin/block-ban',
        method: 'PATCH',
        body: {
          id,
          type
        },
      }),
    }),
  }),
});

export const {
 useCreateCouponMutation,
 useGetCouponsQuery,
 useCreateBannerMutation,
 useGetBannersQuery,
 useBlockBanOrCoupMutation
} = adminApi;
export default adminApi;
