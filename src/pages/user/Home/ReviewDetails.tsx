import React, { SetStateAction, useCallback, useState } from 'react';
import Image from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg';
import FareSummary from '../../../components/user/Home/ReviewDetails/FareSummary';
import FlightDetails from '../../../components/user/Home/ReviewDetails/FlightDetails';
import Info from '../../../components/user/Home/ReviewDetails/Info';
import Insurance from '../../../components/user/Home/ReviewDetails/Insurance';
import TravellersDetails from '../../../components/user/Home/ReviewDetails/TravellersDetails';
import PrNavbar from '../../../components/user/Home/Homepage/PrNavbar';
import CouponSection from '../../../components/user/Home/ReviewDetails/CouponSection';
import { useGetBookingQuery, useUpdateBookingMutation } from '../../../redux/apis/userApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { replace } from 'formik';

interface TravellerData {
}

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

function ReviewDetails() {
  const [travellersDetails, setTravellersDetails] = useState<TravellerData[]>(
    []
  );
  const [insuranceDetails, setInsuranceDetails] = useState({});
  const [couponDetails, setCouponDetails] = useState({});
  const [fareBreakdown, setFareBreakdown] = useState<FareBreakdown>({
    baseFare: 0,
    taxAmount: 0,
    chargesAmount: 0,
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();
  const [updateBooking] = useUpdateBookingMutation();

  const updateTravellersDetails = useCallback(
    (details: SetStateAction<TravellerData[]>) => {
      setTravellersDetails(details);
    },
    []
  );

  const updateInsuranceDetails = useCallback((details: SetStateAction<{}>) => {
    setInsuranceDetails(details);
  }, []);

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

  const handleContinue = async () => {
    try {
      await updateBooking({
        bookingId: params.bookingId,
        travellers: travellersDetails,
      }).unwrap();

      navigate(`/seat-selection/${params.bookingId}`);
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking. Please try again.');
    }
  };

  const params = useParams();
  const {
    data: bookingData,
    isLoading,
    error,
  } = useGetBookingQuery(params.bookingId || '',{
    refetchOnMountOrArgChange:true
  });

  

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
          <div className="flex justify-between mx-[11%] pt-8    text-white ">
            <h2 className="text-2xl font-PlusJakartaSans1000">
              Complete your Booking
            </h2>
            <ul className="text-gray-300 text-sm flex space-x-4">
              <li>Flight Details</li>
              <li>Important Info</li>
              {/* <li>Trip secure</li> */}
              <li>Travellers</li>
              <li>Contact Info</li>
            </ul>
          </div>
          <div className="flex justify-between pb-48 mx-[11%] mt-8">
            <div className="w-3/4 pr-4 space-y-4">
              <FlightDetails
                flightChartId={bookingData.flightChartId}
                bookingClass={bookingData.travelClass}
                fareType={bookingData.fareType}
                totalPrice={bookingData.totalPrice}
              />
              <Info />
              {/* <Insurance onUpdateInsurance={updateInsuranceDetails} /> */}
              <TravellersDetails
                bookingDetails={bookingData}
                travellerType={bookingData.travellerType}
                onUpdateTravellers={updateTravellersDetails}
              />
              <button
          onClick={handleContinue}
          type="button"
                className="px-10 py-3 my-2 text-white rounded-3xl  font-PlusJakartaSans1000 text-xl bg-gradient-to-r from-blue-500 to-purple-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:scale-105"
              >
                CONTINUE
              </button>{' '}    
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

export default ReviewDetails;
