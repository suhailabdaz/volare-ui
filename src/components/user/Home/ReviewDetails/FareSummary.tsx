import { PlusCircleIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface FareBreakdown {
  baseFare: number;
  taxAmount: number;
  chargesAmount: number;
  couponDiscount: number;
}

interface BookingData {
  _id: string;
  userId: string;
  flightChartId: string;
  fareType: string;
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

interface Coupon {
  coupon_code: string;
  coupon_description: string;
  discount: number;
}

interface FareSummaryProps {
  bookingData: BookingData;
  inittotalPrice: number;
  fareBreakdown: FareBreakdown;
  selectedCoupon: Coupon | null;
}

const FareSummary: React.FC<FareSummaryProps> = ({
  inittotalPrice,
  bookingData,
  fareBreakdown,
  selectedCoupon
}) => {
  const [totalPrice, setTotalPrice] = useState(inittotalPrice);
  const [currentFareBreakdown, setCurrentFareBreakdown] = useState(fareBreakdown);

  useEffect(() => {
    let newTotalPrice = inittotalPrice;
    let newFareBreakdown = { ...fareBreakdown };

    if (selectedCoupon) {
      const discountAmount = (inittotalPrice * selectedCoupon.discount) / 100;
      newTotalPrice -= discountAmount;
      newFareBreakdown.couponDiscount = discountAmount;
    } else {
      newFareBreakdown.couponDiscount = 0;
    }

    setTotalPrice(newTotalPrice);
    setCurrentFareBreakdown(newFareBreakdown);
  }, [selectedCoupon, inittotalPrice, fareBreakdown]);

  return (
    <div className="bg-white mb-3 space-y-4 rounded w-full shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5">
      <h1 className="font-PlusJakartaSans1000 text-xl mb-3">Fare Summary</h1>
      
      <div className="flex font-bold text-sm justify-between items-center w-full">
        <label className='flex justify-start items-center'><PlusCircleIcon className='mr-2 h-4'/>Base Fare</label>
        <div className='flex justify-end'>
          <input
            type="number"
            value={currentFareBreakdown.baseFare.toFixed(2)}
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
            value={currentFareBreakdown.taxAmount.toFixed(2)}
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
            value={currentFareBreakdown.chargesAmount.toFixed(2)}
            className="w-2/4"
            readOnly
          />
        </div>
      </div>

      {currentFareBreakdown.couponDiscount > 0 && (
        <div className="flex font-bold text-sm justify-between items-center w-full border-b border-gray-800 pb-3">
          <label className='flex justify-start items-center'><PlusCircleIcon className='mr-2 h-4'/>Discount</label>
          <div className='flex justify-end'>
            <input
              type="number"
              value={currentFareBreakdown.couponDiscount.toFixed(2)}
              className="w-2/4"
              readOnly
            />
          </div>
        </div>
      )}

      {currentFareBreakdown.couponDiscount === 0 && <div className='border-gray-800 border'></div>}

      <div className="mt-3 flex font-PlusJakartaSans1000 justify-between items-center w-full">
        <strong>Total Price</strong>
        <strong className="w-2/4 flex justify-end">₹{totalPrice.toFixed(2)}</strong>
      </div>
    </div>
  );
}

export default FareSummary;