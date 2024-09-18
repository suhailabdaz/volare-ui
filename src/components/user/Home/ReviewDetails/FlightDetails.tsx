import React, { useEffect, useState, useCallback } from 'react';
import {
  useGetChartedFlightQuery,
  useGetsearchAirportsQuery,
  useGetsearchFlightQuery,
} from '../../../../redux/apis/userApiSlice';
import { useDispatch } from 'react-redux';
import { useGetAirlinesQuery } from '../../../../redux/apis/authorityApiSlice';
import createAxios from '../../../../services/axios/UserAxios';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';
import { ArrowLongRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import handlug from '../../../../assets/images/baggage.png';
import luggage from '../../../../assets/images/luggage (1).png';
import CancellationPolicy from './PolicyRow';

interface DataProps {
  flightChartId: string;
  bookingClass:string;
  fareType:string
  totalPrice:number
}



interface baggagePolicy{
  _id:string;
  cabinLimit:number;
  luggageLimit:number;
}

interface refundPolicy{
  _id:string;
  firstPeriodPenalty:number;
  secondPeriodPenalty:number;
  thirdPeriodPenalty:number;
}

const FlightDetails: React.FC<DataProps> = ({ flightChartId,fareType,bookingClass,totalPrice }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [baggagePolicy, setBaggagePolicy] = useState<baggagePolicy | null>(null);
  const [refundPolicy, setRefundPolicy] = useState<refundPolicy | null>(null);
  const dispatch = useDispatch();

  const {
    data: scheduleData,
    isLoading,
    error: chartError,
  } = useGetChartedFlightQuery(flightChartId,{
    refetchOnMountOrArgChange:true
  });

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
        const getBaggagePolicy = () => {
          return airlineData.baggagePolicies.find((policy: { _id: any; }) => policy._id === scheduleData.baggagePolicyId);
        };
      
        setBaggagePolicy(getBaggagePolicy());

        const getRefundPolicy = () => {
          return airlineData.cancellationPolicies.find((policy: { _id: any; }) => policy._id === scheduleData.refundPolicyId);
        };
      
        setRefundPolicy(getRefundPolicy());

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

  

  return (
    <div
      className="bg-white rounded w-[99%] flex flex-col items-center justify-center h-auto shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5"
      id="flightDetails"
    >
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
                {bookingClass} class
              </p>
              <ChevronRightIcon className='h-4'/>
              <p className='text-green-600  font-bold'>{fareType} fare</p>
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
                <p className='text-sm'>max weight {baggagePolicy?.cabinLimit} kgs / Adult</p>
              </div>
              </div>
              
            </div>
            <div className="mx-4  flex justify-center items-center">
              <div className='flex items-center'>
              <img className="h-6" src={luggage} alt="" />
              <div className='mx-2 flex items-center space-x-1'>
                <p ><span className='font-bold text-sm' ></span><span className='font-bold'>checked bags:</span></p>
                <p className='text-sm'>max weight {baggagePolicy?.luggageLimit} kgs / Adult</p>
              </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div className=" bg-purple-50 rounded w-[100%] my-4 p-5">
          <p className='font-PlusJakartaSans1000 '>Cancellation Refund Policy</p>
          <CancellationPolicy totalPrice={totalPrice} refundPolicy={refundPolicy} />
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
