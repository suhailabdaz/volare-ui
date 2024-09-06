import  { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import createAxios from '../../../services/axios/UserAxios';
import { userEndpoints } from '../../../services/endpoints/UserEndpoints';
import { useGetBookingQuery } from '../../../redux/apis/userApiSlice';

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
  travellers: any[];
  travelClass: string;
  departureTime: string;
  seats: Seat[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paymentId: string;
}

function SuccessPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get('booking_id');

  const { data: bookingData, isLoading: bookingLoading, error: bookingError } = useGetBookingQuery(bookingId ?? '');

  useEffect(() => {
    const updateBookingStatus = async () => {
      const sessionId = searchParams.get('session_id');
      const flightChartId = searchParams.get('flightchart_id');
      const seats = searchParams.get('seats');

      if (!sessionId || !bookingId) {
        setError('Missing session ID or booking ID');
        setLoading(false);
        return;
      }

      const processedPayment = localStorage.getItem(`processed_payment_${sessionId}`);
      if (processedPayment) {
        // Payment already processed, booking details will be fetched by the query
        setLoading(false);
      } else {

        try {
          const response = await createAxios(dispatch).post(userEndpoints.afterPayment, { sessionId, bookingId, flightChartId, seats });
          setBooking(response.data);
          setLoading(false);
          localStorage.setItem(`processed_payment_${sessionId}`, 'true');
        } catch (err) {
          setError('Failed to update booking status');
          setLoading(false);
          console.error('Error updating booking status:', err);
        }
      }
    };

    updateBookingStatus();
  }, [location, dispatch, navigate, searchParams, bookingId]);

  useEffect(() => {
    if (!bookingLoading && bookingData) {
      setBooking(bookingData);
      setLoading(false);
    }
    if (bookingError) {
      setError('Failed to fetch booking details');
      setLoading(false);
    }
  }, [bookingData, bookingLoading, bookingError]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

  return (
    booking && (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Booking Successful!</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
      <p><strong>Booking ID:</strong> {booking._id}</p>
      <p><strong>Flight Chart ID:</strong> {booking.flightChartId}</p>
      <p><strong>Travel Class:</strong> {booking.travelClass}</p>
      <p><strong>Departure Time:</strong> {new Date(booking.departureTime).toLocaleString()}</p>
      <p><strong>Total Price:</strong> ${booking.totalPrice.toFixed(2)}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Traveller Information</h3>
      <p><strong>Adults:</strong> {booking.travellerType.adults}</p>
      <p><strong>Children:</strong> {booking.travellerType.children}</p>
      <p><strong>Infants:</strong> {booking.travellerType.infants}</p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Seat Information</h3>
      <ul>
        {booking.seats.map((seat) => (
          <li key={seat._id}>Seat {seat.seatNumber} - {seat.class}</li>
        ))}
      </ul>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Fare Breakdown</h3>
      <p><strong>Base Fare:</strong> ${booking.fareBreakdown.baseFare.toFixed(2)}</p>
      <p><strong>Tax:</strong> ${booking.fareBreakdown.taxAmount.toFixed(2)}</p>
      <p><strong>Additional Charges:</strong> ${booking.fareBreakdown.chargesAmount.toFixed(2)}</p>        </div>
      </div>
    )
  );
}

export default SuccessPage;


