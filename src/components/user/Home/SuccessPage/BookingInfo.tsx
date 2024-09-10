import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetChartedFlightQuery, useGetsearchAirportsQuery, useGetsearchFlightQuery } from '../../../../redux/apis/userApiSlice';
import { useGetAirlinesQuery } from '../../../../redux/apis/authorityApiSlice';
import createAxios from '../../../../services/axios/UserAxios';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';
import { ArrowLongRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import handlug from '../../../../assets/images/baggage.png';
import luggage from '../../../../assets/images/luggage (1).png';
import InfoBooking from './InfoBooking';
import { toast } from 'sonner';

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


interface props {
  bookingData: Booking;
}

const BookingInfo: React.FC<props> = ({ bookingData }) => {

  // const params = useParams() as unknown as Params;
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {
    data: scheduleData,
    isLoading,
    error: chartError,
  } = useGetChartedFlightQuery(bookingData.flightChartId);
  const { data: airportData } = useGetsearchAirportsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: airlineDetails } = useGetAirlinesQuery('airline', {
    refetchOnMountOrArgChange: true,
  });
  const { data: flightDetails } = useGetsearchFlightQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const fetchImageUrl = useCallback(
    async (key: string) => {
      try {
        setLoading(true);
        const response = await createAxios(dispatch).get(
          airlineEndpoints.getImageLink,
          { params: { key } }
        );
        setImageUrl(response.data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error('Error fetching signed URL:', error);
        setError(true);
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const fetchImage = async () => {
      if (scheduleData && airlineDetails) {
        const airlineData = airlineDetails.airlines.find(
          (airline: { _id: string | number }) =>
            airline._id === scheduleData.airlineId
        );
        if (airlineData?.airline_image_link) {
          fetchImageUrl(airlineData.airline_image_link);
        }
      }
    };

    fetchImage();
  }, [scheduleData, airlineDetails, fetchImageUrl]);

  const handleImageError = useCallback(() => {
    if (scheduleData && airlineDetails) {
      const airlineData = airlineDetails.airlines.find(
        (airline: { _id: string | number }) =>
          airline._id === scheduleData.airlineId
      );
      if (airlineData?.airline_image_link) {
        fetchImageUrl(airlineData.airline_image_link);
      }
    }
  }, [scheduleData, airlineDetails, fetchImageUrl]);

  if (!scheduleData || isLoading || chartError) {
    return <div>Loading or no-data or error</div>;
  }

  const getAirportName = (airportId: string) => {
    const airport = airportData?.airports.find(
      (a: { _id: string }) => a._id === airportId
    );
    return airport ? airport.airport_code : 'Unknown Airport';
  };

  const getAirportCode = (airportId: string) => {
    const airport = airportData?.airports.find(
      (a: { _id: string }) => a._id === airportId
    );
    return airport ? airport.airport_name : 'Unknown Airport';
  };

  const getFlightCode = (scheduleFlight_id: string) => {
    const flight = flightDetails?.find(
      (a: { _id: string }) => a._id === scheduleFlight_id
    );
    return flight ? flight.flight_code : 'Unknown Flight';
  };

  const getAirportCity = (airportId: string) => {
    const airport = airportData?.airports.find(
      (a: { _id: string }) => a._id === airportId
    );
    return airport ? airport.city : 'Unknown Airport';
  };

  const getAirlineName = (airlineId: string) => {
    const airline = airlineDetails?.airlines.find(
      (a: { _id: string }) => a._id === airlineId
    );
    return airline ? airline.airline_name : 'Unknown Airline';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short', 
    });
  };

  const formatDuration = (duration: string): string => {
    const [hours, minutes] = duration.split(':').map(Number);

    const formattedHours = hours > 0 ? `${hours}h` : '';
    const formattedMinutes = minutes > 0 ? `${minutes}m` : '';

    return `Direct · ${formattedHours} ${formattedMinutes}`.trim();
  };

  const handleClick = async () => {
    try {
        navigate(`/my-trips`, { replace: true });
      }
      catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking. Please try again.');
    }
  };
  // const calculateAge = (dateOfBirth: string | number | Date) => {
  //   const today = new Date();
  //   const birthDate = new Date(dateOfBirth);
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDifference = today.getMonth() - birthDate.getMonth();
    
  //   if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
    
  //   return age;
  // };

  return (
    <div
      className="bg-white rounded w-[99%] flex flex-col items-center justify-center h-auto shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5"
      id="flightDetails"
    >
      <div className=" bg-green-100 rounded w-[98%] mb-10  mt-6 border p-2 border-green-700">
          <InfoBooking bookingId={bookingData._id}  />
        </div>
        <div className=" w-[98%] mb-8  p-2">
              <h2 className='font-PlusJakartaSans font-bold text-lg text-gray-600'>Confirmation number: {bookingData._id}</h2>
              <p className='mt-2 font-PlusJakartaSans font-normal text-gray-600 text-base '>Thank you for booking your travel with Godspeed! Below is a summary of your trip to Bengaluru. We’ve sent a copy of your booking confirmation to your email address.</p>
              <button className='font-PlusJakartaSans mt-2 text-base font-bold text-blue-600 ' onClick={()=>handleClick()}>My Trips</button>
        </div>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="shadow-[0_0_10px_rgba(0,0,0,0.15)] bg-white rounded w-full  mb-5">
          <div className="mb-8  border-l-4 border-green-600  items-center">
            <div className="flex justify-start px-3 pt-3 space-x-2 items-center">
              <h2 className="text-xl font-bold ">
                {getAirportCity(scheduleData.fromAirport_Id)}
              </h2>
              <ArrowLongRightIcon className="h-6" />
              <h2 className="text-xl font-bold ">
                {getAirportCity(scheduleData.toAirport_Id)}
              </h2>
            </div>
            <div className="flex justify-start items-center space-x-2 px-3 font-bold text-sm py-1">
              <p className="p-1 bg-orange-100 rounded">
                {formatDate(scheduleData.departureDate)}
              </p>
              <p>{formatDuration(scheduleData.duration)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-5 m-5">
            <div className="flex justify-start items-center space-x-4">
              {loading ? (
                <div>Loading image...</div>
              ) : error ? (
                <div onClick={handleImageError} className="cursor-pointer">
                  Error loading image. Click to retry.
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt="Airline Logo"
                  className="w-12 h-12 "
                  onError={handleImageError}
                />
              )}
              <div className="font-PlusJakartaSans1000 text-gray-700">
                <p className="font-PlusJakartaSans font-bold text-sm">
                  {getAirlineName(scheduleData.airlineId)}
                </p>
                <p>{getFlightCode(scheduleData.flightId)}</p>
              </div>
            </div>
            <div className='flex items-center justify-center space-x-1 '>
              <p className="font-PlusJakartaSans font-bold">
                {bookingData.travelClass} class
              </p>
              <ChevronRightIcon className='h-4'/>
              <p className='text-green-600  font-bold'>{bookingData.fareType} fare</p>
            </div>
          </div>
          <div className="m-6 p-6 bg-neutral-100 mb-4">
          <div className=" items-center space-y-1">
            {/* First Circle */}
            <div className="flex items-center">
              <div className="border-2 border-gray-600 rounded-full w-4 h-4"></div>
              <div>
                <div className="mx-2 flex justify-start space-x-2 text-xs">
                  <p>{formatDate(scheduleData.departureDate)}</p>,
                  <p className='font-PlusJakartaSans1000'>{scheduleData.departureTime}</p>
                </div>
                <div className="flex mx-2 space-x-1 font-bold text-sm">
                  <p>{getAirportName(scheduleData.fromAirport_Id)},</p>
                  <p>{getAirportCode(scheduleData.fromAirport_Id)}</p>
                </div>
              </div>
            </div>

            {/* Vertical Line */}
            <div className="flex justify-start">
              <div className="border-l-2 mx-2  w-1 border-gray-500 h-6 "></div>
            </div>

            {/* Second Circle */}
            <div className="flex items-center">
              <div className="border-2 border-gray-600 rounded-full w-4 h-4"></div>
              <div>
                <div className="mx-2 flex justify-start space-x-2  text-xs">
                  <p>{formatDate(scheduleData.arrivalDate)}</p>,
                  <p className='font-PlusJakartaSans1000'>{scheduleData.arrivalTime}</p>
                </div>
                <div className="flex mx-2 space-x-1 font-bold text-sm">
                <p>{getAirportName(scheduleData.toAirport_Id)},</p>
                <p>{getAirportCode(scheduleData.toAirport_Id)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start  border-t-2 border-gray-300 mt-6 py-4 ">
          
            <div className=" flex justify-center items-center">
              <div className='flex items-center'>
              <img className="h-6" src={handlug} alt="" />
              <div className='mx-2 flex items-center space-x-1'>
                <p ><span className='font-bold text-sm' ></span><span className='font-bold'>cabin bags:</span></p>
                <p className='text-sm'>max weight 7 kgs / Adult</p>
              </div>
              </div>
              
            </div>
            <div className="mx-4  flex justify-center items-center">
              <div className='flex items-center'>
              <img className="h-6" src={luggage} alt="" />
              <div className='mx-2 flex items-center space-x-1'>
                <p ><span className='font-bold text-sm' ></span><span className='font-bold'>checked bags:</span></p>
                <p className='text-sm'>max weight 23 kgs / Adult</p>
              </div>
              </div>
              
            </div>
          </div>
          </div>
        </div>
        
      </div>
      <div className="w-[95%] max-w-4xl mx-auto mb-10 p-4 rounded-lg bg-gray-100 border border-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-start text-gray-600">Traveller and Seat Information</h2>
      
      <div className="grid grid-cols-3 gap-4 font-semibold mb-2 text-gray-700">
        <div className="flex items-center">
          <span>Traveller</span>
        </div>
        <div className="flex items-center">
          <span>Seat</span>
        </div>
        <div>Class</div>
      </div>

      {bookingData.travellers.map((traveller, index) => (
        <div key={traveller._id} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200 last:border-b-0">
          <div>{traveller.firstName} {traveller.lastName}, {traveller.gender}</div>
          <div>{bookingData.seats[index]?.seatNumber || 'Not assigned'}</div>
          <div>{bookingData.seats[index]?.class || 'N/A'}</div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default BookingInfo