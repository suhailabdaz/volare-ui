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

    userData: UserData | null;
}

const initialState: UserState = {
    userData: null,
};

const ProfileSlice = createSlice({
    name: "Profile",
    initialState,
    reducers: {
        userProfileDetails :(state , action:PayloadAction<{user_data:UserData}>)=>{
            state.userData= action.payload.user_data
        },
        logout: (state) => {
          state.userData = null;
      },
    }
})

export const { userProfileDetails,logout} = ProfileSlice.actions;
export default ProfileSlice;
