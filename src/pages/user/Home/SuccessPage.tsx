import  { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import createAxios from '../../../services/axios/UserAxios';
import { useDispatch } from 'react-redux';
import { userEndpoints } from '../../../services/endpoints/UserEndpoints';
interface TravellerType {
  adults: number;
  children: number;
  infants: number;
}

interface FareBreakdown {
  baseFare: number;
  taxAmount: number;
  chargesAmount: number;
}

interface Seat {
  seatNumber: string;
  travellerId: string;
  class: string;
  _id: string;
}

interface Booking {
  travellerType: TravellerType;
  fareBreakdown: FareBreakdown;
  _id: string;
  userId: string;
  flightChartId: string;
  fareType: string;
  travellers: any[]; // Replace `any[]` with a more specific type if the structure of a traveller object is known.
  travelClass: string;
  departureTime: string; // ISO date string
  seats: Seat[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  paymentId: string;
}



function SuccessPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);
  const location = useLocation();
  const dispatch = useDispatch()

  useEffect(() => {
    const updateBookingStatus = async () => {
      const searchParams = new URLSearchParams(location.search);
      const sessionId = searchParams.get('session_id');
      const bookingId = searchParams.get('booking_id');
      const flightChartId = searchParams.get('flightchart_id')
      const seats = searchParams.get('seats')

      if (!sessionId || !bookingId) {
        setError('Missing session ID or booking ID');
        setLoading(false);
        return;
      }

      try {
        const response = await createAxios(dispatch).post(userEndpoints.afterPayment, { sessionId, bookingId,flightChartId,seats });
        setBooking(response.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to update booking status');
        setLoading(false);
        console.error('Error updating booking status:', err);
      }
    };

    updateBookingStatus();
  }, [location]);

  return (
    booking && (
      <div>
        {booking._id}
      </div>
    )
  );
  
}

export default SuccessPage