import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { validateHeroState } from '../validation/HeroValidation'; 

interface Airport {
  _id: string;
  airport_code: string;
  city: string;
  airport_name: string;
  country: string;
}

interface DepartureDateState {
  date: string | null;
  weekday:string | null
}

interface TravellersState {
  total: number;
  adults: number;
  children: number;
  infants: number;
}

export interface HeroState {
  tripType: 'oneWay' | 'roundTrip';
  selectedValue: string;
  classState: string;
  fromAirport: Airport | null;
  toAirport: Airport | null;
  departureDate: DepartureDateState;
  returnDate: DepartureDateState;
  travellers: TravellersState;
  hasErrors:boolean
}

const today = new Date();

const initialState: HeroState = {
  tripType: 'oneWay',
  selectedValue: 'Regular',
  classState: 'Economy',
  fromAirport: null,
  toAirport: null,
  departureDate: {
    date:today.toISOString(),
    weekday: today.toLocaleDateString('en-US', { weekday: 'long' }),
  },
  returnDate: {
    date: null,
    weekday: ''
  },
  travellers: {
    total: 1,
    adults: 1,
    children: 0,
    infants: 0,
  },
  hasErrors:false
};

const HeroSlice = createSlice({
  name: 'Hero',
  initialState,
  reducers: {
    setTripType(state, action: PayloadAction<'oneWay' | 'roundTrip'>) {
      state.tripType = action.payload;
    },
    setSelectedValue(state, action: PayloadAction<string>) {
      state.selectedValue = action.payload;
    },
    setClassState(state, action: PayloadAction<string>) {
      state.classState = action.payload;
    },
    setFromAirport(state, action: PayloadAction<Airport | null>) {
      state.fromAirport = action.payload;
    },
    setToAirport(state, action: PayloadAction<Airport | null>) {
      state.toAirport = action.payload;
    },
    setDepartureDate(state, action: PayloadAction<DepartureDateState>) {
      state.departureDate = action.payload;
    },
    setReturnDate(state, action: PayloadAction<DepartureDateState>) {
      state.returnDate = action.payload;
    },
    updateTravellers(state, action: PayloadAction<Partial<TravellersState>>) {
      const updatedValues = action.payload;
      state.travellers = {
        ...state.travellers,
        ...updatedValues,
        total: (updatedValues.adults ?? state.travellers.adults) +
               (updatedValues.children ?? state.travellers.children) +
               (updatedValues.infants ?? state.travellers.infants),
      };
    },
    validateState(state) {
      const isValid = validateHeroState(state);
      state.hasErrors = !isValid; 
    },
  },
});

export const {
  setTripType,
  setSelectedValue,
  setClassState,
  setFromAirport,
  setToAirport,
  setDepartureDate,
  setReturnDate,
  updateTravellers,
  validateState
} = HeroSlice.actions;


export default HeroSlice;
