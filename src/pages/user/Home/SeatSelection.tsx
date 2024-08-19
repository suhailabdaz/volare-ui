import { useParams } from 'react-router-dom';
import Image from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg';
import PrNavbar from '../../../components/user/Home/Homepage/PrNavbar';
import CouponSection from '../../../components/user/Home/SeatSelection/CouponSection';
import FareSummary from '../../../components/user/Home/SeatSelection/FareSummary';
import { useGetBookingQuery } from '../../../redux/apis/userApiSlice';
import { SetStateAction, useCallback, useState } from 'react';
import SeatLayout from '../../../components/user/Home/SeatSelection/SeatLayout';

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
  const [couponDetails, setCouponDetails] = useState({});
  const [fareBreakdown, setFareBreakdown] = useState<FareBreakdown>({
    baseFare: 0,
    taxAmount: 0,
    chargesAmount: 0,
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const updateCouponDetails = useCallback((details: SetStateAction<{}>) => {
    setCouponDetails(details);
  }, []);

  const updateFareAndTotal = useCallback(
    (newFareBreakdown: FareBreakdown, newTotal: number) => {
      setFareBreakdown(newFareBreakdown);
      setTotalPrice(newTotal);
    },
    []
  );

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
          <div className="flex justify-between mx-[11%] pt-8 sticky top-0   text-white ">
            <h2 className="text-2xl font-PlusJakartaSans1000">
              Complete your Booking
            </h2>
            {/* <ul className="text-gray-300 text-sm flex space-x-4">
              <li>Flight Details</li>
              <li>Important Info</li>
              <li>Travellers</li>
              <li>Contact Info</li>
            </ul> */}
          </div>
          <div className="flex justify-between pb-48 mx-[11%] mt-8">
            <div className="w-3/4 pr-4 space-y-4">
              <SeatLayout
                flightChartId={bookingData.flightChartId}
                classType={bookingData.travelClass}
                travellers={bookingData.travellers}
              />
              <button
                // onClick={handleContinue}
                type="button"
                className="px-10 py-3 my-2 text-white rounded-3xl  font-PlusJakartaSans1000 text-xl bg-gradient-to-r from-blue-500 to-purple-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:scale-105"
              >
                CONTINUE
              </button>{' '}
            </div>
            <div className="w-1/4 sticky top-20 h-full">
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
