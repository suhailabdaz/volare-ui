import  { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import createAxios from '../../../services/axios/UserAxios';
import { userEndpoints } from '../../../services/endpoints/UserEndpoints';
import { useGetBookingQuery } from '../../../redux/apis/userApiSlice';
import PrNavbar from '../../../components/user/Home/Homepage/PrNavbar';
import Image from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg';
import BookingInfo from '../../../components/user/Home/SuccessPage/BookingInfo';
import FareBreakDown from '../../../components/user/Home/SuccessPage/FareBreakDown';

interface TravellerType {
  adults: number;
  children: number;
  infants: number;
}

interface FareBreakdown {
  baseFare: number;
  taxAmount: number;
  chargesAmount: number;
  couponDiscount:number;
  extraCharges:number;

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
    <div className="bg-[#f9f1fe] min-h-screen font-PlusJakartaSans">
      <PrNavbar />
      <div className="relative">
        <div className="">
          <img
            src={Image}
            className="w-full h-[40vh] absolute z-0 opacity-95 "
            alt="Background"
          />
        </div>
        <div className="relative z-10 ">
          <div className="flex justify-between mx-[11%] pt-8    text-white ">
            <h2 className="text-2xl font-PlusJakartaSans1000">
               Booking confirmation
            </h2>
          </div>
          <div className="flex justify-between pb-48 mx-[11%] mt-8">
            <div className="w-3/4 pr-4 space-y-4">
              <BookingInfo
                bookingData={booking}
              />
      
            </div>
            <div className="w-1/4 sticky top-12 h-full">
              <FareBreakDown
                bookingData={booking}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  );
}

export default SuccessPage;


