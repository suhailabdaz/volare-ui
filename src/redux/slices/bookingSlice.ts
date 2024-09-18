import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Coupon {
  coupon_code: string;
  coupon_description: string;
  discount: number;
}

interface fareBreakdown {
baseFare:number,
taxAmount:number,
chargesAmount:number,
couponDiscount:number,
extraCharges:number,
}



interface BookingState{
  coupon:Coupon | null
  fareBreakdown:fareBreakdown
  totalPrice:number | null
}

const initialState: BookingState = {
  fareBreakdown: {
    baseFare: 0,
    taxAmount: 0,
    chargesAmount: 0,
    couponDiscount: 0,
    extraCharges: 0,
  },
  totalPrice: 0,
  coupon: null,
};

const BookingSlice = createSlice({
  name: 'Booking',
  initialState,
  reducers: {
    setCoupon: (state,action : PayloadAction<Coupon | null>) => {
      state.coupon = action.payload;
    },
    removeBooking:(state)=>{
      state.coupon = null
    },
    setFareBreakdown: (state, action: PayloadAction<{ FareBreakdown: fareBreakdown }>) => {
      state.fareBreakdown = action.payload.FareBreakdown;
    },
    setTotalPrice: (state, action: PayloadAction< number >) => {
      state.totalPrice = action.payload;
    },
    
  },
});

export const {
  setCoupon,
  removeBooking,
  setFareBreakdown,
  setTotalPrice
} = BookingSlice.actions;


export default BookingSlice;
