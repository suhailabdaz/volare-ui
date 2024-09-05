import  { SetStateAction, useCallback, useEffect, useState } from 'react';
import Image from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg';
import FareSummary from '../../../components/user/Home/ReviewDetails/FareSummary';
import FlightDetails from '../../../components/user/Home/ReviewDetails/FlightDetails';
import Info from '../../../components/user/Home/ReviewDetails/Info';
// import Insurance from '../../../components/user/Home/ReviewDetails/Insurance';
import TravellersDetails from '../../../components/user/Home/ReviewDetails/TravellersDetails';
import PrNavbar from '../../../components/user/Home/Homepage/PrNavbar';
import CouponSection from '../../../components/user/Home/ReviewDetails/CouponSection';
import {
  useGetBookingQuery,
  useUpdateBookingMutation,
} from '../../../redux/apis/userApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ShimmerReview from './pageShimmers/ShimmerReview';
import { Link as ScrollLink } from 'react-scroll';
import { useApplyCouponMutation } from '../../../redux/apis/userApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { setCoupon,setFareBreakdown, setTotalPrice } from '../../../redux/slices/bookingSlice';
import { useDispatch } from 'react-redux';
import ContactDetails from '../../../components/user/Home/ReviewDetails/ContactDetails';


interface TravellerData {}

interface Coupon {
  coupon_code: string;
  coupon_description: string;
  discount: number;
}


interface FareBreakdown {
  baseFare: number;
  taxAmount: number;
  chargesAmount: number;
}

interface Contactdetails {
  phone: string;
  email: string;
}


export interface BookingData {
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
  couponCode: string;
  contactDetails:{
    phone:string,
    email:string
  }
}

function ReviewDetails() {
  const [isValidToSubmit, setIsValidToSubmit] = useState(false);

  const [travellersDetails, setTravellersDetails] = useState<TravellerData[]>(
    []
  );

  const [insuranceDetails, setInsuranceDetails] = useState({});
  const [couponDetails, setCouponDetails] = useState<Coupon | null>(null);
  const [fareBreakdown, setFareBreakdown] = useState<FareBreakdown>({
    baseFare: 0,
    taxAmount: 0,
    chargesAmount: 0,
  });

  const [contactDetails,setContactDetails] = useState<ContactDetails|null>(null)
  const [totalPrice, setTotalPrice] = useState(0);
  const userState = useSelector((state: RootState) => state.UserAuth.userData);
  const statecouponDetails = useSelector((state: RootState) => state.BookingAuth.coupon);
  const statefareBreakdown = useSelector((state: RootState) => state.BookingAuth.fareBreakdown);
  const statetotalPrice = useSelector((state: RootState) => state.BookingAuth.totalPrice);
  const dispatch = useDispatch()

  const navigate = useNavigate();
  const [updateBooking] = useUpdateBookingMutation();
  const [applyCoupon] = useApplyCouponMutation();

  const updateInsuranceDetails = useCallback((details: SetStateAction<{}>) => {
    setInsuranceDetails(details);
    refetch();
  }, []);

  const updateContactDetails = useCallback((details: Contactdetails) => {
    setContactDetails(details);
    refetch();
  }, []);

  const updateCouponDetails = useCallback((coupon: Coupon | null) => {

    if (coupon) {
      setCouponDetails(coupon);
      dispatch(setCoupon(coupon))
    } else {
      setCouponDetails(null);
      dispatch(setCoupon(coupon))
    }
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
      if (!isValidToSubmit) {
        toast.warning(
          'Please fill in all required traveller details before continuing.'
        );
        return;
      } else {
        await updateBooking({
          bookingId: params.bookingId,
          travellers: travellersDetails,
          contactDetails:contactDetails
        }).unwrap();
      
        navigate(`/seat-selection/${params.bookingId}`, { replace: true });
      }
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
    refetch,
  } = useGetBookingQuery(params.bookingId || '', {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (bookingData && bookingData.travellers) {
      setTravellersDetails(bookingData.travellers);
      const { adults, children, infants } = bookingData.travellerType;
      const totalRequired = adults + children + infants;
      const isValid = bookingData.travellers.length === totalRequired;
      setIsValidToSubmit(isValid);
    }
  }, [bookingData]);

  const updateTravellersDetails = useCallback(
    (details: TravellerData[]) => {
      setTravellersDetails(details);
      if (bookingData) {
        const { adults, children, infants } = bookingData.travellerType;
        const totalRequired = adults + children + infants;
        const isValid = details.length === totalRequired;
        setIsValidToSubmit(isValid);
      }
    },
    [bookingData]
  );

  if (isLoading) {
    return (
      <div>
        <ShimmerReview />
      </div>
    );
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
              <li className="cursor-pointer">
                <ScrollLink
                  to="flightDetails"
                  spy={true}
                  smooth={true}
                  duration={500}
                >
                  Flight Details
                </ScrollLink>
              </li>
              <li className="cursor-pointer">
                <ScrollLink
                  to="importantInfo"
                  spy={true}
                  smooth={true}
                  duration={500}
                >
                  Important info
                </ScrollLink>
              </li>
              {/* <li>Trip secure</li> */}
              <li className="cursor-pointer">
                <ScrollLink
                  to="travellers"
                  spy={true}
                  smooth={true}
                  duration={500}
                >
                  Travellers
                </ScrollLink>
              </li>
              <li className='cursor-pointer'><ScrollLink
                  to="contactDetails"
                  spy={true}
                  smooth={true}
                  duration={500}
                >
                  Contact Details
                </ScrollLink></li>
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
              <ContactDetails
              onUpdateContact={updateContactDetails}
              bookingData={bookingData}
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
                bookingData={bookingData}
                inittotalPrice={bookingData.totalPrice}
                fareBreakdown={bookingData.fareBreakdown}
                selectedCoupon={couponDetails}
              />
              <CouponSection
                bookingData={bookingData}
                bookingId={bookingData._id}
                totalPrice={bookingData.totalPrice}
                addedCoupon={bookingData.coupon}
                onCouponApplied={updateCouponDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewDetails;
