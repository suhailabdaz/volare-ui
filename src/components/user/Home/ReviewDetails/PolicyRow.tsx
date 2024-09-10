import React from 'react';

interface refundPolicy{
  _id:string;
  firstPeriodPenalty:number;
  secondPeriodPenalty:number;
  thirdPeriodPenalty:number;
}

interface CancellationPolicyProps {
  totalPrice: number;
  refundPolicy:refundPolicy | null
}

const CancellationPolicy: React.FC<CancellationPolicyProps> = ({ totalPrice,refundPolicy }) => {
  const calculateCancellationCharge = (percentage: number): number => {
    return totalPrice * (percentage / 100);
  };

  const policies = [
    { timeFrame: "0-4h", charge: calculateCancellationCharge(refundPolicy?.thirdPeriodPenalty ||100), color: "#FF0000" },
    { timeFrame: "4h-4d", charge: calculateCancellationCharge(refundPolicy?.secondPeriodPenalty || 100), color: "#FFA500" },
    { timeFrame: "4d-365d", charge: calculateCancellationCharge(refundPolicy?.firstPeriodPenalty|| 100), color: "#00FF00" },
  ];

  return (
    <div className="bg-transparent rounded w-full p-5 mx-2 font-PlusJakartaSans font-bold">
      <div className=" flex w-full h-20 rounded overflow-hidden mb-1">
        <div className='w-[20%] mt-5 items-center space-y-5 font-PlusJakartaSans1000 text-xs'>
          <p>Cancellation Penalty</p>
          <p>Cancellation between</p>
        </div>
        <div className="flex h-[0.35rem]  w-[80%] rounded bg-gradient-to-r from-red-700 via-yellow-600 to-green-700">
          {policies.map((policy, index) => (
            <div 
              key={index}
              className="flex-grow my-3 space-y-3 " 
            >
              <div className=" text-center text-xs text-black p-1">
              { policy.charge.toFixed(2)}
              </div>
              <div className=" text-center text-xs text-black p-1">
              {policy.timeFrame}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-sm mt-5 text-gray-600">
        <p>* Cancellation charges include Airline fee + Volare fee per passenger</p>
        <p>* The cancellation charge is calculated based on the total ticket price of ₹{totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CancellationPolicy;