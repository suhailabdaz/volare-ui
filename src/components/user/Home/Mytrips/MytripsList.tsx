import { useState } from 'react';
import { useGetBookingsByStatusQuery } from '../../../../redux/apis/userApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { useNavigate } from 'react-router-dom';

interface TripStatus {
  upcoming: boolean;
  completed: boolean;
  cancelled: boolean;
  unsuccessful: boolean;
}
interface ITraveller {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string; 
  nationality: string;
  mealPreference: string;
  passportNo: string;
  passportNationality: string;
  passportExpiry: string;
  phone: string;
  email: string;
  userId: string;
  createdAt: string;
  updatedAt: string; 
  __v: number;
}

interface ISeat {
  seatNumber: string;
  travellerId: string;
  class: 'economyClass' | 'businessClass' | 'firstClass';
  _id: string;
}

interface IFareBreakdown {
  baseFare: number;
  taxAmount: number;
  chargesAmount: number;
  couponDiscount: number;
  extraCharges: number;
}

interface IContactDetails {
  phone: string;
  email: string;
}

export interface IBooking {
  _id: string;
  userId: string;
  flightChartId: string;
  fareType: string;
  travellers: ITraveller[];
  travelClass: string;
  departureTime: string; // ISO date string
  seats: ISeat[];
  totalPrice: number;
  travellerType: {
    adults: number;
    children: number;
    infants: number;
  };
  fareBreakdown: IFareBreakdown;
  status: 'pending' | 'confirmed' | 'cancelled' | 'traveller' | 'seats' | 'expired';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  couponCode?: string;
  contactDetails?: IContactDetails;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

function MytripsList() {

  
  const [selectedStatus, setSelectedStatus] = useState<TripStatus>({
    upcoming: true,
    completed: false,
    cancelled: false,
    unsuccessful: false,
  });
  
  const currentStatus = Object.keys(selectedStatus).find(
    (key) => selectedStatus[key as keyof TripStatus]
  ) as string;

  const userData = useSelector((state:RootState)=>state.UserAuth.userData)


  const { data: bookings, isLoading, isError } = useGetBookingsByStatusQuery({
    id: userData?._id,
    status: currentStatus
  },{
    refetchOnMountOrArgChange:true
  });

  const Navigate = useNavigate()


  const renderBookingList = () => {
    if (isLoading) return <p>Loading bookings...</p>;
    if (isError) return <p>Error fetching bookings. Please try again.</p>;
    if (!bookings || bookings.length === 0) return <div className='flex  justify-center items-center'>  
      <div className='space-y-12'>
      <p className='font-PlusJakartaSans1000 text-lg'>No bookings found for this status.</p>
      <div className='flex justify-center items-center'>
      <button onClick={()=>{Navigate('/')}} className='rounded-2xl bg-gradient-to-r from-purple-700 to bg-purple-500 px-8 py-3 text-white font-PlusJakartaSans1000 text-center'>Plan A trip</button>
      </div>
      </div> 
      </div>

    return (
      <ul className="space-y-4">
        {bookings.map((booking: IBooking) => (
          <li key={booking._id}  onClick={() => {
            if (booking.status === 'pending') {
              Navigate(`/review-details/${booking._id}`);
            }
          }} className="bg-gray-100 p-4 rounded-md shadow">
            <h3 className="font-bold text-lg">{booking.flightChartId}</h3>
            <p>Status: {booking.status}</p>
            <p>From: {booking.departureTime} To: {booking.paymentStatus}</p>
            {/* Add more booking details as needed */}
          </li>
        ))}
      </ul>
    );
  };


  const handleStatusChange = (status: keyof TripStatus) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [status]: true,
      upcoming: status === 'upcoming',
      completed: status === 'completed',
      cancelled: status === 'cancelled',
      unsuccessful: status === 'unsuccessful',
    }));
  };

  return (
    <div
    className={`flex justify-center ${
      selectedStatus.upcoming
        ? 'bg-gradient-to-r from-[#5ee7cd] to-[#7dbfcc]'
        : selectedStatus.completed
        ? 'bg-gradient-to-r from-[#cfcfcf] to-[#afb3ba]'
        : selectedStatus.cancelled
        ? 'bg-gradient-to-r from-[#f3d452] to-[#f09819]'
        : selectedStatus.unsuccessful
        ? 'bg-gradient-to-r from-[#ff7f3f] to-[#ff3e5e]'
        : ''
    } h-full`}
  >
      <div className="bg-white mt-20  min-h-96 rounded-md shadow-custom_shadow w-full mx-[11%] p-6">
        <div className="flex w-full shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.1)] font-PlusJakartaSans1000 text-gray-600 text-lg  justify-between  pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <button
              className={`px-4 py-2  transition-all duration-300 ${
                selectedStatus.upcoming
                  ? ' border-b-4 border-b-blue-600 '
                  : 'border-b-4 border-b-transparent'
              }`}
              onClick={() => handleStatusChange('upcoming')}
            >
              UPCOMING
            </button>
            <button
              className={`px-4 py-2  transition-all duration-300 ${
                selectedStatus.completed
                  ? 'border-b-4 border-b-blue-600 '
                  : 'border-b-4 border-b-transparent'
              }`}
              onClick={() => handleStatusChange('completed')}
            >
              COMPLETED
            </button>
            <button
              className={`px-4 py-2  transition-all duration-300 ${
                selectedStatus.cancelled
                  ? 'border-b-4 border-b-blue-600 '
                  : 'border-b-4 border-b-transparent'
              }`}
              onClick={() => handleStatusChange('cancelled')}
            >
              CANCELLED
            </button>
            <button
              className={`px-4 py-2  transition-all duration-300 ${
                selectedStatus.unsuccessful
                  ? 'border-b-4 border-b-blue-600 '
                  : 'border-b-4 border-b-transparent'
              }`}
              onClick={() => handleStatusChange('unsuccessful')}
            >
              UNSUCCESSFUL
            </button>
          </div>
        </div>

        {renderBookingList()}
      </div>
    </div>
  );
}

export default MytripsList;