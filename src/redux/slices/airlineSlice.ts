import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface FlightData {
  _id: string;
  flight_code: string;
  manufacturer: string;
  economy_seats: number;
  business_seats: number;
  first_class_seats: number;
  status: Boolean;
  schedules?: Schedule[];
}

interface AirlineData {
  _id: string;
  airline_email: string;
  airline_code: string;
  airline_name: string;
  status?: boolean;
  airline_image_link: string;
}

interface AirlineState {
  isAuthenticated: boolean;
  token: string | null;
  airlineData: AirlineData | null;
  fleet: FlightData[];
}

const initialState: AirlineState = {
  isAuthenticated: false,
  token: null,
  airlineData: null,
  fleet: [],
};

const airlineAuthSlice = createSlice({
  name: 'AirlineAuth',
  initialState,
  reducers: {
    airlinelogin: (
      state,
      action: PayloadAction<{ token: string; airline_data: AirlineData }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.airlineData = action.payload.airline_data;
    },
    newToken: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    airlinelogout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.airlineData = null;
      state.fleet = [];
    },
    airlineProfileDetails: (
      state,
      action: PayloadAction<{ airline_data: AirlineData }>
    ) => {
      state.airlineData = action.payload.airline_data;
    },
    setFlightDetails: (state, action: PayloadAction<FlightData>) => {
      const fleet = state.fleet || [];
      const index = fleet.findIndex(
        (flight) => flight._id === action.payload._id
      );
      if (index >= 0) {
        // Update existing flight
        fleet[index] = action.payload;
      } else {
        // Add new flight
        fleet.push(action.payload);
      }
    },
    setFlights: (state, action: PayloadAction<[FlightData]>) => {
      state.fleet = action.payload;
    },
  },
});

export const {
  airlinelogin,
  airlinelogout,
  newToken,
  airlineProfileDetails,
  setFlightDetails,
  setFlights,
} = airlineAuthSlice.actions;
export default airlineAuthSlice;
