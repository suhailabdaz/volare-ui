import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Date } from 'firebase/vertexai-preview';

interface TravellerData {
  _id:string
  userId: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: Date; 
  nationality?: string;
  mealPreference?: string;
  passportNo?: string;
  passportNationality?: string;
  passportExpiry?: Date; 
  phone?: string;
  email?: string;
}
interface TravellerState {
    travellers: TravellerData[];
}

const initialState: TravellerState = {
    travellers: [],
};

const travellerSlice = createSlice({
    name: "Travellers",
    initialState,
    reducers: {
        setTravellerDetails: (state, action: PayloadAction<TravellerData>) => {
            const index = state.travellers.findIndex(traveller => traveller._id === action.payload._id);
            if ( index >= 0 ) {
                state.travellers[index] = action.payload;
            } else {
                state.travellers.push(action.payload);
            }
        },
        setTravellers: (state, action: PayloadAction<TravellerData[]>) => {
          state.travellers = action.payload;
        },
        removeTraveller: (state, action: PayloadAction<string>) => {
            state.travellers = state.travellers.filter(traveller => traveller._id !== action.payload);
        },
        clearTravellers: (state) => {
            state.travellers = [];
        }
    }
});

export const { setTravellerDetails, removeTraveller, clearTravellers,setTravellers } = travellerSlice.actions;
export default travellerSlice;
