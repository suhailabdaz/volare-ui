import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface FareBreakdown {
  baseFare: number;
  taxAmount: number;
  chargesAmount: number;
}

interface FareSummaryProps {
  initialFareBreakdown: FareBreakdown;
  initialTotalPrice: number;
  onUpdateFareAndTotal: (
    fareBreakdown: FareBreakdown,
    totalPrice: number
  ) => void;
}

function FareSummary({
  initialFareBreakdown,
  initialTotalPrice,
  onUpdateFareAndTotal,
}: FareSummaryProps) {
  const [fareBreakdown, setFareBreakdown] = useState(initialFareBreakdown);
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice);

  useEffect(() => {
    // This effect will run whenever the fareBreakdown or totalPrice state changes
    onUpdateFareAndTotal(fareBreakdown, totalPrice);
  }, [fareBreakdown, totalPrice, onUpdateFareAndTotal]);

  const updateFare = (key: keyof FareBreakdown, value: number) => {
    const newFareBreakdown = { ...fareBreakdown, [key]: value };
    setFareBreakdown(newFareBreakdown);

    // Recalculate total price
    const newTotalPrice =
      newFareBreakdown.baseFare +
      newFareBreakdown.taxAmount +
      newFareBreakdown.chargesAmount;
    setTotalPrice(newTotalPrice);
  };

  return (
    <div className="bg-white mb-3 space-y-4  rounded w-full shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5">
      <h1 className="font-PlusJakartaSans1000 text-xl mb-3">Fare Summary</h1>
      
      <div className="flex font-bold text-sm justify-between items-center w-full">
      <label className='flex justify-start items-center '><PlusCircleIcon className='mr-2 h-4'/>Base Fare</label>
      <div className='flex justify-end'>

      <input
          type="number"
          value={fareBreakdown.baseFare.toFixed(2)}
          onChange={(e) => updateFare('baseFare', parseFloat(e.target.value))}
          className="w-2/4" // Adjust width as needed
        />
        </div>
      </div>
      
      <div className="flex font-bold text-sm justify-between items-center w-full">
        <label className='flex justify-start items-center '><PlusCircleIcon className='mr-2 h-4'/>Taxes</label>
        <div className='flex justify-end'>

        <input
          type="number"
          value={fareBreakdown.taxAmount.toFixed(2)}
          onChange={(e) => updateFare('taxAmount', parseFloat(e.target.value))}
          className="w-2/4"
        />
        </div>
      </div>
      
      <div className="flex font-bold text-sm justify-between items-center w-full border-b border-gray-800 pb-3">
      <label className='flex justify-start items-center '><PlusCircleIcon className='mr-2 h-4'/>Charges</label>
      <div className='flex justify-end'>
      <input
          type="number"
          value={fareBreakdown.chargesAmount.toFixed(2)}
          onChange={(e) =>
            updateFare('chargesAmount', parseFloat(e.target.value))
          }
          className="w-2/4"
        />
        </div>
      </div>

      <div className="mt-3 flex font-PlusJakartaSans1000 justify-between items-center w-full">
        <strong>Total Price</strong>
        <strong className="w-2/4 flex justify-end">₹{totalPrice.toFixed(2)}</strong>
      </div>
    </div>
  );
}

export default FareSummary;
