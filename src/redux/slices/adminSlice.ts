import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  _id: string;
  name: string;
  email: string;
  status: boolean;
  gender?: string;
  address?: string;
  birthday?: Date;
  pincode?: Number;
  state?: string;
  mobile?: Number;
}

interface AirlineData {
  _id: string;
  airline_email: string;
  airline_code: string;
  airline_name: string;
  status?: boolean;
  airline_image_link: string;
}

interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  users: UserData[];
  airlines: AirlineData[];
}

const initialState: AdminState = {
  isAuthenticated: false,
  token: null,
  users: [],
  airlines: [],
};

const adminAuthSlice = createSlice({
  name: 'AdminAuth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.users = [];
      state.airlines = [];
    },
    setUsers: (state, action: PayloadAction<UserData[]>) => {
      state.users = action.payload;
    },
    setAirlines: (state, action: PayloadAction<AirlineData[]>) => {
      state.airlines = action.payload;
    },
    clearUsers: (state) => {
      state.users = [];
    },
  },
});

export const { login, logout, setUsers, clearUsers,setAirlines } = adminAuthSlice.actions;
export default adminAuthSlice;
