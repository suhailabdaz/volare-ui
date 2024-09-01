import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import handlug from '../../../../../assets/images/baggage.png';
import perslug from '../../../../../assets/images/school-bag.png';
import luggage from '../../../../../assets/images/luggage (1).png';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './ToolTip';
import { useInitiateBookingMutation } from '../../../../../redux/apis/userApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store/store';

interface ModalProps {
  closeModal: () => any;
  airlineData: any;
  scheduleData: any;
  flightData: any;
  fromAirport: any;
  toAirport: any;
  imageURLs: any;
}

const TicketTypes: React.FC<ModalProps> = ({
  closeModal,
  flightData,
  scheduleData,
  airlineData,
  fromAirport,
  toAirport,
  imageURLs,
}) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const [createBooking, { isLoading }] = useInitiateBookingMutation();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.ProfileAuth.userData);



  const adults = params.adults ? parseInt(params.adults, 10) : 0;
  const children = params.children ? parseInt(params.children, 10) : 0;
  const infants = params.infants ? parseInt(params.infants, 10) : 0;
  
  const totalPassenger = adults + children;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    };
    return date.toLocaleDateString('en-GB', options); 
  };

  const basePrice =
  params.class === 'Economy'
    ? scheduleData?.currentPrices?.economy
    : params.class === 'Business'
    ? scheduleData?.currentPrices?.business
    : params.class === 'FirstClass'
    ? scheduleData?.currentPrices?.firstClass
    : 0;

// Calculate the total price before tax and charges
const totalPriceBeforeExtras = basePrice * totalPassenger;

// Add 10% tax and 20% charges
const tax = 0.1; // 10%
const charges = 0.2; // 20%
const taxprice = 0.1 * totalPriceBeforeExtras; // 10% tax
  const chargeprice = 0.2 * totalPriceBeforeExtras; // 20% charges
const totalPriceWithExtras =
  totalPriceBeforeExtras * (1 + tax + charges);

// Format the total price in Indian currency style with commas
const formattedPrice = totalPriceWithExtras
  ? totalPriceWithExtras.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  : 'N/A';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const bookingData = {
      userId: userData?._id, 
      flightChartId: scheduleData._id,
      departureTime: scheduleData.departureDate,
      totalPrice: totalPriceWithExtras,
      travelClass: params.class,
      travellerType:{
        adults:adults,
        children:children,
        infants:infants
      },
      fareBreakdown:{
        baseFare:totalPriceBeforeExtras,
        taxAmount:taxprice,
        chargesAmount:chargeprice
      },
      fareType:params.fareType || "Regular"
    };

    const result = await createBooking(bookingData).unwrap();
    if(result && result._id){
      navigate(`/review-details/${result._id}`)
    }
    setIsSubmitting(false);
    
  };

  const formatDuration = (duration: string): string => {
    const [hours, minutes] = duration.split(':').map(Number);

    const formattedHours = hours > 0 ? `${hours}h` : '';
    const formattedMinutes = minutes > 0 ? `${minutes}m` : '';

    return `Direct · ${formattedHours} ${formattedMinutes}`.trim();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white px-8 py-6 shadow-lg w-[50%] rounded-lg mb-12 overflow-hidden">
        <div className=" items-center mb-10">
          <h2 className="text-lg text-left font-PlusJakartaSans font-bold mb-1">
            Your flight to {toAirport?.city}
          </h2>
          <p>
            <p className="text-sm">{formatDuration(scheduleData.duration)}</p>
          </p>
        </div>
        <div className="flex justify-between mb-8 border-b pb-8 border-gray-300">
          <div className=" items-center space-y-1">
            {/* First Circle */}
            <div className="flex items-center">
              <div className="border-2 border-gray-600 rounded-full w-4 h-4"></div>
              <div>
                <div className="mx-2 flex justify-start space-x-2 text-xs">
                  <p>{formatDate(scheduleData.departureDate)}</p>,
                  <p>{scheduleData.departureTime}</p>
                </div>
                <div className="flex mx-2 space-x-1 font-bold text-sm">
                  <p>{fromAirport.airport_code}</p>
                  <p>{fromAirport.airport_name}</p>
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
                  <p>{scheduleData.arrivalTime}</p>
                </div>
                <div className="flex mx-2 space-x-1 font-bold text-sm">
                  <p>{toAirport.airport_code}</p>
                  <p>{toAirport.airport_name}</p>
                </div>
              </div>
            </div>
          </div>
          {/* the flight details */}
          <div className="flex space-x-4 items-start mx-16 ">
            <div className=" h-10 w-10 flex  justify-center text-lg text-black font-bold bg-white">
              {loading[airlineData?.airline_image_link] ? (
                <span>Loading...</span>
              ) : error[airlineData?.airline_image_link] ? (
                <span>Error</span>
              ) : (
                <img
                  src={imageURLs[airlineData?.airline_image_link]}
                  alt={`${airlineData?.airline_name} Logo`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="items-center">
              <div className="flex font-bold space-x-2 items-end">
                <p>{airlineData.airline_name}</p>
                <p className="text-sm">{flightData.flight_code}</p>
              </div>
              <p className="text-sm">{formatDuration(scheduleData.duration)}</p>
              <p className="text-sm">{params.class}</p>
            </div>
          </div>
        </div>
        {/* Luggage information */}
        <div className="flex h-auto ">
          <div className="w-[30%] border-r mb-5 border-gray-500 space-y-1">
            <h1 className="font-PlusJakartaSans1000 text-lg">
              Included Baggage
            </h1>
            <p className="text-sm pr-4">
              The total baggage included in the price
            </p>
          </div>
          <div className="w-[70%] h-48 space-y-5">
          <div className="mx-4  flex justify-between items-center">
              <div className='flex items-center'>
              <img className="h-6" src={perslug} alt="" />
              <div className='mx-4'>
                <p className='space-x-1'><span className='font-bold text-sm' >{totalPassenger}</span><span className='font-light'>personal items</span></p>
                <p className='text-xs'>Fit under the seat in front tof you</p>
              </div>
              </div>
              <p className='text-green-800 font-semibold text-right'>Included</p>
            </div>
            <div className="mx-4  flex justify-between items-center">
              <div className='flex items-center'>
              <img className="h-6" src={handlug} alt="" />
              <div className='mx-4'>
                <p className='space-x-1'><span className='font-bold text-sm' >{totalPassenger}</span><span className='font-light'>cabin bags</span></p>
                <p className='text-xs'>max weight 7 kgs</p>
              </div>
              </div>
              
              <p className='text-green-800 font-semibold text-right'>Included</p>
            </div>
            <div className="mx-4  flex justify-between items-center">
              <div className='flex items-center'>
              <img className="h-6" src={luggage} alt="" />
              <div className='mx-4'>
                <p className='space-x-1'><span className='font-bold text-sm' >{totalPassenger}</span><span className='font-light'>checked bags</span></p>
                <p className='text-xs'>max weight 23 kgs</p>
              </div>
              </div>
              
              <p className='text-green-800 font-semibold text-right'>Included</p>
            </div>
          </div>
        </div>

        <div className="w-full bg-white pt-4 pb-2 px-6 border-t border-gray-300 flex justify-between items-end space-x-4">
          <div className='space-y-1' >
            <div className='space-x-2 flex'>
            <p className='font-PlusJakartaSans1000 text-2xl'><span>     ₹{formattedPrice}
            </span></p>
            <Tooltip content={
             <div className='p-2 space-y-1'>
            <h1 className='font-PlusJakartaSans1000 text-xl mb-2'>Price breakdown</h1>
             <p className='flex justify-between text-sm'><span>Base Fare:</span> ₹{basePrice?.toLocaleString('en-IN')}</p>
             <p className='flex justify-between text-sm'> <span>Tax:</span> ₹{taxprice?.toLocaleString('en-IN')}</p>
             <p className='flex justify-between text-sm'><span>Charges:</span> ₹{chargeprice?.toLocaleString('en-IN')}</p>
             <p className='font-PlusJakartaSans1000 flex justify-between text-base'><span>Total Price:</span> ₹{formattedPrice}</p>
             <p className='text-xs'>Total price fro all travellers</p>

           </div>
            }>
            <button>
              <InformationCircleIcon className='h-6 font-bold'/>
            </button>
            </Tooltip>
            </div>

            
            
            <p className='text-xs'>Total price fro all travellers</p>
          </div>
          <div className='lex justify-end space-x-4'>
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-2 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500 hover:scale-105"
          >
            BACK
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-2 text-white rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'SELECT'}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketTypes;
