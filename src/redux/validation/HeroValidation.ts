import { toast } from 'sonner';
import { HeroState } from '../slices/HeroSlice'; // Adjust the import path based on your file structure

export const validateHeroState = (state: HeroState): boolean => {
  const errors: string[] = [];
  const today = new Date();

  // Check if from and to airport are the same
  if (state.fromAirport && state.toAirport && state.fromAirport._id === state.toAirport._id) {
    errors.push('The departure and destination airports cannot be the same.');
  }

  // Check if departure date is in the past
  if (state.departureDate.date) {
    const departureDate = new Date(state.departureDate.date);
    if (departureDate < today) {
      errors.push('The departure date cannot be in the past.');
    }
  }

  // Check if return date is in the past
  if (state.returnDate.date) {
    const returnDate = new Date(state.returnDate.date);
    if (returnDate < today) {
      errors.push('The return date cannot be in the past.');
    }
  }

  // Check if return date is required but not provided
  if (state.tripType === 'roundTrip' && !state.returnDate.date) {
    errors.push('A return date is required for round trips.');
  }

  // Display all errors using toast notifications
  errors.forEach(error => toast.warning(error, {
    position: 'top-right',
  }));

  return errors.length === 0;
};
