import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface schedule{
  _id: string;
  fromAirport_Id: string;
  toAirport_Id: string;
  arrivalTime: string;
  duration: string;
  departureTime: string;
  daysOfWeek: string[];
  isSuspended: boolean;
}

interface flightData {
  _id:string
  flight_code: string;
  schedules: schedule[];
  makers: string;
  seats: string;
}

interface AirlineData {
    _id: string;
    airline_name: string;
    email: string;
    status : boolean ;
    password? : string;
    fleets:flightData[];
    logo_image_link:string
}

interface AirlineState {
    isAuthenticated: boolean;
    token: string | null;
    airlineData: AirlineData | null;
}

const initialState: AirlineState = {
    isAuthenticated: false,
    token: null,
    airlineData: null,
};

const airlineAuthSlice = createSlice({
    name: "AirlineAuth",
    initialState,
    reducers: {
        airlinelogin: (state,action: PayloadAction<{ token: string; airline_data: AirlineData }>) => {
            console.log("Redux User Slice: ", action.payload);
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.airlineData = action.payload.airline_data;
        },
        airlinelogout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.airlineData = null;
        },
        airlineProfileDetails :(state , action:PayloadAction<{airline_data:AirlineData}>)=>{
            state.airlineData= action.payload.airline_data
        }
    }
})

export const { airlinelogin, airlinelogout  , airlineProfileDetails} = airlineAuthSlice.actions;
export default airlineAuthSlice;
