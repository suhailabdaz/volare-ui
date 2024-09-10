import { PlusCircleIcon } from '@heroicons/react/24/outline';
import React from 'react'


interface TravellerType {
  adults: number;
  children: number;
  infants: number;
}

interface FareBreakdown {
  baseFare: number;
  taxAmount: number;
  chargesAmount: number;
  couponDiscount:number;
  extraCharges:number;
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

const FareBreakDown: React.FC<props> = ({ bookingData }) => {
  return (
    <>
<div className="bg-white mb-3 space-y-4 rounded w-full shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5">
      <h1 className="font-PlusJakartaSans1000 text-xl mb-3">Fare Summary</h1>
      
      <div className="flex font-bold text-sm justify-between items-center w-full">
        <label className='flex justify-start items-center'><PlusCircleIcon className='mr-2 h-4'/>Base Fare</label>
        <div className='flex justify-end'>
          <input
            type="number"
            value={bookingData.fareBreakdown.baseFare.toFixed(2)}
            className="w-2/4" 
            readOnly
          />
        </div>
      </div>
      
      <div className="flex font-bold text-sm justify-between items-center w-full">
        <label className='flex justify-start items-center'><PlusCircleIcon className='mr-2 h-4'/>Taxes</label>
        <div className='flex justify-end'>
          <input
            type="number"
            value={bookingData.fareBreakdown.taxAmount.toFixed(2)}
            className="w-2/4"
            readOnly
          />
        </div>
      </div>
      
      <div className="flex font-bold text-sm justify-between items-center w-full">
        <label className='flex justify-start items-center'><PlusCircleIcon className='mr-2 h-4'/>Charges</label>
        <div className='flex justify-end'>
          <input
            type="number"
            value={bookingData.fareBreakdown.chargesAmount.toFixed(2)}
            className="w-2/4"
            readOnly
          />
        </div>
      </div>

      {bookingData.fareBreakdown.couponDiscount > 0 && (
        <div className="flex font-bold text-sm justify-between items-center w-full  ">
          <label className='flex justify-start items-center'><PlusCircleIcon className='mr-2 h-4'/>Discount</label>
          <div className='flex justify-end'>
            <input
              type="number"
              value={bookingData.fareBreakdown.couponDiscount.toFixed(2)}
              className="w-2/4"
              readOnly
            />
          </div>
        </div>
      )}

      {bookingData.fareBreakdown.extraCharges > 0 && (
        <div className="flex font-bold text-sm justify-between items-center w-full pb-3">
          <label className='flex justify-start items-center'><PlusCircleIcon className='mr-2 h-4'/>Extra</label>
          <div className='flex justify-end'>
            <input
              type="number"
              value={bookingData.fareBreakdown.extraCharges.toFixed(2)}
              className="w-2/4"
              readOnly
            />
          </div>
        </div>
      )}
      { <div className='border-gray-800 border'></div>}

      <div className="mt-3 flex font-PlusJakartaSans1000 justify-between items-center w-full">
        <strong>Total Price</strong>
        <strong className="w-2/4 flex justify-end">₹{bookingData.totalPrice?.toFixed(2)}</strong>
      </div>
    </div>
    <div className='mt-6 w-full '>
      <h1 className='font-PlusJakartaSans1000 text-xl'>Payment Method</h1>
      <div className='mt-2 w-full h-32 space-y-8 rounded-lg bg-gradient-to-br p-4 from-pink-400  to-pink-500'>
        <div className='flex justify-start items-start'>
        <h1 className='font-PlusJakartaSans1000 text-lg text-white'>Card Payment</h1>
        </div>
        <div className='flex items-end  justify-between'>
          <h1 className='font-PlusJakartaSans text-lg text-white'></h1>
        <h1 className='font-PlusJakartaSans text-lg text-white'>XX / XX</h1>
        </div>
      </div>
    </div>
    
    </>
  );  
}

export default FareBreakDown