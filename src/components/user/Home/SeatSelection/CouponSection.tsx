import React from 'react';
import Gift from '../../../../assets/images/gift.png'

interface CouponDetailsProps {
  onApplyCoupon: (coupon: any) => void; 
}

const CouponSection: React.FC<CouponDetailsProps> = ({ onApplyCoupon }) => {
  return (
    <div className='bg-white rounded w-full shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans'>
      <div className='bg-gradient-to-b from-amber-500 via-amber-400  to-amber-200 flex justify-between p-4'>
          <h1 className='font-normal text-white text-lg '><span className='font-PlusJakartaSans1000'>COUPON</span> CODES</h1>
          <div className='w-1/4 rounded-full flex  items-center'>
            <img src={Gift} className='h-8' alt="" />
          </div>
      </div>
      <div className='space-y-4 p-4'>
        <input
          type="text"
          placeholder="Enter coupon code"
          className="w-full p-2 border border-gray-300 mb-4 rounded outline-none"
        />
        <a href="#" className="text-blue-500  text-xs font-bold">VIEW ALL COUPONS</a>
      </div>
    </div>
  );
}

export default CouponSection;