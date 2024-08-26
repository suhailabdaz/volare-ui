import { useNavigate, useParams } from 'react-router-dom';
import Image from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg';
import PrNavbar from '../../../components/user/Home/Homepage/PrNavbar';
import CouponSection from '../../../components/user/Home/SeatSelection/CouponSection';
import FareSummary from '../../../components/user/Home/SeatSelection/FareSummary';
import {
  useGetBookingQuery,
  useGetsearchAirportsQuery,
  useGetsearchFlightQuery,
  useUpdateBookingSeatsMutation,
} from '../../../redux/apis/userApiSlice';
import { SetStateAction, useCallback, useState } from 'react';
import SeatLayout from '../../../components/user/Home/SeatSelection/SeatLayout';
import BacktoFlightTrav from '../../../components/user/Home/SeatSelection/BacktoFlightTrav';
import MealSelection from '../../../components/user/Home/SeatSelection/MealSelection';
import MealsImage from '../../../assets/images/rice-bowl.png';
import seatsImage from '../../../assets/images/seat.png';
import { toast } from 'sonner';

interface TravellerData {}

interface FareBreakdown {
  baseFare: number;
  taxAmount: number;
  chargesAmount: number;
}

interface BookingData {
  _id: string;
  userId: string;
  flightChartId: string;
  fareType: string;
  travellers: TravellerData[];
  travelClass: string;
  seats: string[];
  totalPrice: number;
  travellerType: {
    adults: number;
    children: number;
    infants: number;
  };
  fareBreakdown: FareBreakdown;
  status: string;
  paymentStatus: string;
}

function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState<
    {
      seatNumber: string;
      travellerId: string;
      class: 'economyClass' | 'businessClass' | 'firstClass';
    }[]
  >([]);
  const [mealsseats, seatmealsseats] = useState('seats');
  const [couponDetails, setCouponDetails] = useState({});
  const [fareBreakdown, setFareBreakdown] = useState<FareBreakdown>({
    baseFare: 0,
    taxAmount: 0,
    chargesAmount: 0,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [updateBookingSeat] = useUpdateBookingSeatsMutation();

  const updateCouponDetails = useCallback((details: SetStateAction<{}>) => {
    setCouponDetails(details);
  }, []);

  const updateSelectedSeats = useCallback((newSelectedSeats: { 
    seatNumber: string; 
    travellerId: string; 
    class: 'economyClass' | 'businessClass' | 'firstClass' 
  }[]) => {
    setSelectedSeats(newSelectedSeats);
  }, [setSelectedSeats]);

  const updateFareAndTotal = useCallback(
    (newFareBreakdown: FareBreakdown, newTotal: number) => {
      setFareBreakdown(newFareBreakdown);
      setTotalPrice(newTotal);
    },
    []
  );

  const navigate  = useNavigate()

  const params = useParams();
  const {
    data: bookingData,
    isLoading,
    error,
  } = useGetBookingQuery(params.bookingId || '');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !bookingData) {
    return <div>Error loading booking data</div>;
  }

  const updateSeatDetails = useCallback(async () => {
    try {
      await updateBookingSeat({
        bookingId: params.bookingId,
        seats: selectedSeats,
      }).unwrap();  
      
      toast.success('seat selected')

      navigate(`/payment-ssection/${params.bookingId}`);

     } catch (error) {
      toast.error('error task');
    }
  }, [bookingData._id, selectedSeats, updateBookingSeat]);

  return (
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
          <div className="flex justify-between mx-[11%] pt-8  text-white ">
            <h2 className="text-2xl font-PlusJakartaSans1000">
              Complete your Booking
            </h2>
            <ul className="text-gray-300 text-sm flex space-x-4">
              <li>Flight & travellers details</li>
              <li>Seat Selection</li>
              <li>Meals</li>
            </ul>
          </div>
          <div className="flex justify-between pb-48 mx-[11%] mt-8">
            <div className="w-3/4 pr-4 space-y-4">
              <BacktoFlightTrav flightChartId={bookingData.flightChartId} />
              <div className="bg-white p-5 items-center">
                <div className="flex justify-start items-center font-PlusJakartaSans1000 mb-4 w-full space-x-1 bg-white ">
                  <button
                    className={`flex items-center justify-start space-x-1 p-2 ${
                      mealsseats === 'seats'
                        ? 'border-b-2 border-blue-500'
                        : 'border-b-2 border-white'
                    }`}
                    onClick={() => seatmealsseats('seats')}
                  >
                    <img src={seatsImage} className="h-5" alt="" />
                    <p>Seats</p>
                  </button>
                  <button
                    className={`flex items-center justify-start space-x-1 p-2 ${
                      mealsseats === 'meals'
                        ? 'border-b-2 border-blue-500'
                        : 'border-b-2 border-white'
                    }`}
                    onClick={() => seatmealsseats('meals')}
                  >
                    <img src={MealsImage} className="h-5" alt="" />
                    <p>Meals</p>
                  </button>
                </div>
                {mealsseats === 'seats' ? (
                  <SeatLayout
                    flightChartId={bookingData.flightChartId}
                    classType={bookingData.travelClass}
                    travellers={bookingData.travellers}
                    bookingData={bookingData}
                    onSeatSelected={updateSelectedSeats}
                  />
                ) : (
                  <MealSelection />
                )}
              </div>
              <button
                onClick={updateSeatDetails}
                type="button"
                className="px-10 py-3 my-2 text-white rounded-3xl font-PlusJakartaSans1000 text-xl bg-gradient-to-r from-blue-500 to-purple-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:scale-105"
              >
                CONTINUE
              </button>
            </div>
            <div className="w-1/4 sticky top-12 h-full">
              <FareSummary
                initialFareBreakdown={bookingData.fareBreakdown}
                initialTotalPrice={bookingData.totalPrice}
                onUpdateFareAndTotal={updateFareAndTotal}
              />
              <CouponSection onApplyCoupon={updateCouponDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
