import  { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import createAxios from '../../../services/axios/UserAxios';
import { useDispatch } from 'react-redux';
import { userEndpoints } from '../../../services/endpoints/UserEndpoints';



function SuccessPage() {
  const [booking, setBooking] = useState(null);
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
        setBooking(response.data.booking);
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
    <div>
      {booking}
    </div>
  )
}

export default SuccessPage