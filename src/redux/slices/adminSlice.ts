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



interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  users: UserData[];
}

const initialState: AdminState = {
  isAuthenticated: false,
  token: null,
  users: [],
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
    },
    setUsers: (state, action: PayloadAction<UserData[]>) => {
      state.users = action.payload;
    },
    newToken: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
  },
});

export const { login, logout, setUsers,newToken } = adminAuthSlice.actions;
export default adminAuthSlice;
