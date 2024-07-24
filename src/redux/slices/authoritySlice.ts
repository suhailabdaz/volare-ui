import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Airports {
  _id: string;
  airport_code: string;
  airport_name: string;
  city: string;
  country: string;
}

interface Schedule {
  _id: string;
  fromAirport_Id: string;
  toAirport_Id: string;
  arrivalTime: string;
  duration: string;
  departureTime: string;
  daysOfWeek: string[];
  isSuspended: boolean;
}

interface AuthorityState {
  isAuthenticated: boolean;
  token: string | null;
  airports: Airports[];
  schedules: Schedule[];
}

const initialState: AuthorityState = {
  isAuthenticated: false,
  token: null,
  airports: [],
  schedules: [],
};

const authorityAuthSlice = createSlice({
  name: "AuthorityAuth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
    setAirportDetails: (state, action: PayloadAction<Airports>) => {
      const index = state.airports.findIndex(airport => airport._id === action.payload._id);
      if (index >= 0) {
        state.airports[index] = action.payload;
      } else {
        state.airports.push(action.payload);
      }
    },
    setAirports: (state, action: PayloadAction<Airports[]>) => {
      state.airports = action.payload;
    },
    removeAirport: (state, action: PayloadAction<string>) => {
      state.airports = state.airports.filter(airport => airport._id !== action.payload);
    },
    clearAirports: (state) => {
      state.airports = [];
    },
    setSchedule: (state, action: PayloadAction<Schedule>) => {
      const index = state.schedules.findIndex(schedule => schedule._id === action.payload._id);
      if (index >= 0) {
        state.schedules[index] = action.payload;
      } else {
        state.schedules.push(action.payload);
      }
    }, 
    setSchedules: (state, action: PayloadAction<Schedule[]>) => {
      state.schedules = action.payload;
    },
    removeSchedule: (state, action: PayloadAction<string>) => {
      state.schedules = state.schedules.filter(schedule => schedule._id !== action.payload);
    },
    clearSchedules: (state) => {
      state.schedules = [];
    }
  }
});

export const {
  login,
  logout,
  setAirportDetails,
  setAirports,
  removeAirport,
  clearAirports,
  setSchedule,
  setSchedules,
  removeSchedule,
  clearSchedules,
} = authorityAuthSlice.actions;

export default authorityAuthSlice;
