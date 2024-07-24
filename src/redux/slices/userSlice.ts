import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
    _id: string;
    name: string;
    email: string;
    status : boolean ;
    gender?: string;
    password? : string;
    address?: string;
    birthday?:Date;
    pincode?:Number;
    state?:string;
    mobile?:Number
}

interface UserState {
    isAuthenticated: boolean;
    token: string | null;
    userData: UserData | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    token: null,
    userData: null,
};

const userAuthSlice = createSlice({
    name: "UserAuth",
    initialState,
    reducers: {
        login: (state,action: PayloadAction<{ token: string; user_data: UserData }>) => {
            console.log("Redux User Slice: ", action.payload);
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.userData = action.payload.user_data;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.userData = null;
        },
        updateUserEmail: (state, action: PayloadAction<{ email: string }>) => {
            if (state.userData) {
                state.userData.email = action.payload.email; 
            }
        },
        userProfileDetails :(state , action:PayloadAction<{user_data:UserData}>)=>{
            state.userData= action.payload.user_data
        }
    }
})

export const { login, logout ,updateUserEmail , userProfileDetails} = userAuthSlice.actions;
export default userAuthSlice;
