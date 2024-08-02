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
    mobile?:Number;
    image_link?:string;
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
        updateProfileImage: (state, action: PayloadAction<{ image_link: string }>) => {
            if (state.userData) {
              state.userData.image_link = action.payload.image_link;
            }
          },
        logout: (state) => {
          state.userData = null;
      },
    }
})

export const { userProfileDetails,logout,updateProfileImage} = ProfileSlice.actions;
export default ProfileSlice;
