import React, { useState, useEffect } from 'react';
import Gift from '../../../../assets/images/gift.png';
import { useGetCouponsQuery } from '../../../../redux/apis/adminApiSlice';
import { useGetUsedCouponsQuery } from '../../../../redux/apis/userApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';

interface CouponSectionProps {
  bookingId: string;
  totalPrice: number;
  addedCoupon: Coupon | null;
  onCouponApplied: (coupon: Coupon | null) => void;
  bookingData: BookingData;
}

interface Coupon {
  coupon_code: string;
  coupon_description: string;
  discount: number;
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
  status: string;
  paymentStatus: string;
  couponCode: string;
}

const CouponSection: React.FC<CouponSectionProps> = ({ 
  bookingId, 
  totalPrice, 
  onCouponApplied, 
  addedCoupon, 
  bookingData 
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(addedCoupon);
  const [isLoading, setIsLoading] = useState(false);

  const userState = useSelector((state: RootState) => state.UserAuth.userData);

  useEffect(() => {
    onCouponApplied(selectedCoupon);
  }, [selectedCoupon, onCouponApplied]);

  const {
    data: usedCoupons = [],
    isLoading: usedCouponsLoading,
    error: usedCouponsError
  } = useGetUsedCouponsQuery(userState?._id || '', {
    refetchOnMountOrArgChange: true
  });

  const {
    data: allCoupons = [],
    isLoading: couponsLoading,
    error: couponsError
  } = useGetCouponsQuery({}, {
    refetchOnMountOrArgChange: true
  });

  const filteredCoupons = allCoupons.filter((coupon: Coupon) => 
    !usedCoupons.includes(coupon.coupon_code)
  );


  const handleCouponSelect = (coupon: Coupon) => {
    setIsLoading(true);
    setSelectedCoupon(prevCoupon => 
      prevCoupon?.coupon_code === coupon.coupon_code ? null : coupon
    );
    setIsLoading(false);
  };


  if (couponsLoading || usedCouponsLoading) {
    return <div>Loading coupons...</div>;
  }

  if (couponsError || usedCouponsError) {
    return <div>Error loading coupons. Please try again later.</div>;
  }

  const availableCoupons = filteredCoupons.length > 0 ? filteredCoupons : (addedCoupon ? [addedCoupon] : []);

  return (
    <div className='bg-white rounded w-full shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans'>
      <div className='bg-gradient-to-b from-amber-500 via-amber-400 to-amber-200 flex justify-between p-4'>
        <h1 className='font-normal text-white text-lg'>
          <span className='font-PlusJakartaSans1000'>COUPON</span> CODES
        </h1>
        <div className='w-1/4 rounded-full flex items-center'>
          <img src={Gift} className='h-8' alt="Gift icon" />
        </div>
      </div>
      <div className='space-y-4 p-4'>
        <div className="mt-4 space-y-2">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : availableCoupons.length > 0 ? (
            availableCoupons.map((coupon: Coupon) => (
              <div key={coupon.coupon_code} className="border p-2 bg-gray-100 rounded">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={coupon.coupon_code}
                    name="coupon"
                    checked={selectedCoupon?.coupon_code === coupon.coupon_code}
                    onChange={() => handleCouponSelect(coupon)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={coupon.coupon_code} className="font-bold">{coupon.coupon_code}</label>
                </div>
                <p className="text-sm text-gray-600 mx-3 mt-1">{coupon.coupon_description}</p>
                {selectedCoupon?.coupon_code === coupon.coupon_code && (
                  <button 
                    className="text-red-500 text-sm font-PlusJakartaSans1000 mx-3 mt-2"
                    onClick={() => handleCouponSelect(coupon)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No available coupons</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CouponSection;