import React from 'react';
import {
  useGetChartedFlightQuery,
  useGetsearchAirportsQuery,
} from '../../../../redux/apis/userApiSlice';
import { ArrowLongRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';

interface props {
  flightChartId: string;
}

const BacktoFlightTrav: React.FC<props> = ({ flightChartId }) => {
  const navigate = useNavigate()
  const { data: airportData } = useGetsearchAirportsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const { data: scheduleData } = useGetChartedFlightQuery(flightChartId,{
    refetchOnMountOrArgChange:true
  });

  const params = useParams();

  const getAirportCity = (airportId: string) => {
    const airport = airportData?.airports.find(
      (a: { _id: string }) => a._id === airportId
    );
    return airport ? airport.city : 'Unknown Airport';
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

  const handleGoback = () => {
    navigate(`/review-details/${params.bookingId}`, { replace: true });
  };

  return (
    <div
      className="bg-white rounded w-[99%] items-center h-auto shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans px-5 py-2"
      id="flight_travellers_details"
    >
      <h3 className='font-PlusJakartaSans1000 text-xl mt-3'>
        Flight summary and Travellers
      </h3>
      <div className="w-full flex  items-end justify-between my-3">
        <div className="flex items-center space-x-5">
          <div className="flex justify-start  space-x-1 items-center">
            <h2 className="text-md text-gray-600 font-PlusJakartaSans1000 ">
              {getAirportCity(scheduleData.fromAirport_Id)}
            </h2>
            <ArrowLongRightIcon className="h-4 font-PlusJakartaSans1000 text-lg" />
            <h2 className="text-md font-PlusJakartaSans1000 text-gray-600 ">
              {getAirportCity(scheduleData.toAirport_Id)}
            </h2>
          </div>
          <div className="flex justify-start items-center space-x-2  font-bold text-xs ">
            <p className="p-1 bg-orange-100 rounded-lg">
              {formatDate(scheduleData.departureDate)}
            </p>
            <p>{formatDuration(scheduleData.duration)}</p>
          </div>
        </div>
        <div>
          <button onClick={()=>{handleGoback()}}>
            <ChevronDownIcon className='h-6'/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BacktoFlightTrav;
