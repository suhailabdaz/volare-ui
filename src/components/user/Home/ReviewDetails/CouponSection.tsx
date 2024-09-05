import React, { useState, useEffect, useCallback } from 'react';
import Gift from '../../../../assets/images/gift.png';
import { useGetCouponsQuery } from '../../../../redux/apis/adminApiSlice';
import { useGetUsedCouponsQuery, useApplyCouponMutation } from '../../../../redux/apis/userApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';

interface CouponSectionProps {
  bookingId: string;
  totalPrice: number;
  addedCoupon:Coupon
  onCouponApplied: (newTotalPrice: number, discountAmount: number) => void;
}

interface Coupon {
  coupon_code: string;
  coupon_description: string;
  discount: number;
}

const CouponSection: React.FC<CouponSectionProps> = ({ bookingId, totalPrice,onCouponApplied,addedCoupon }) => {
  const userState = useSelector((state: RootState) => state.UserAuth.userData);
  
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  
 
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

  const [applyCoupon] = useApplyCouponMutation();

  const filteredCoupons = allCoupons.filter((coupon: Coupon) => 
    !usedCoupons.includes(coupon.coupon_code)
  );

 

  const calculateDiscountedPrice = (price: number, discount: number) => {
    const discountAmount = price * (discount / 100);
    return price - discountAmount;
  };

  const updateCouponDetails = useCallback(async (coupon: Coupon | null) => {
    setIsApplying(true);
    try {
       await applyCoupon({ 
        bookingId, 
        userId: userState?._id, 
        coupon: coupon ? coupon : null 
      }).unwrap();

      
        if (coupon) {
          const newTotalPrice = calculateDiscountedPrice(totalPrice, coupon.discount);
          const discountAmount = totalPrice - newTotalPrice;
          onCouponApplied(newTotalPrice, discountAmount);
        } else {
          onCouponApplied(totalPrice, 0);
        }
     
    } catch (error) {
      console.error('Failed to apply/remove coupon:', error);
    } finally {
      setIsApplying(false);
    }
  }, [ applyCoupon]);

  useEffect(() => {
    if (selectedCoupon) {
      const coupon = filteredCoupons.find((c: Coupon) => c.coupon_code === selectedCoupon);
      if (coupon) {
        updateCouponDetails(coupon);
      }
    } 
  }, [selectedCoupon]);

  const handleCouponSelect = (couponCode: string) => {
    setSelectedCoupon(couponCode === selectedCoupon ? null : couponCode);
  };

  if (couponsLoading || usedCouponsLoading) {
    return <div>Loading coupons...</div>;
  }

  if (couponsError || usedCouponsError) {
    return <div>Error loading coupons. Please try again later.</div>;
  }

  return (
    <div className='bg-white rounded w-full shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans'>
      <div className='bg-gradient-to-b from-amber-500 via-amber-400 to-amber-200 flex justify-between p-4'>
        <h1 className='font-normal text-white text-lg'>
          <span className='font-PlusJakartaSans1000'>COUPON</span> CODES
        </h1>
        <div className='w-1/4 rounded-full flex items-center'>
          <img src={Gift} className='h-8' alt="" />
        </div>
      </div>
      <div className='space-y-4 p-4'>
        <div className="mt-4 space-y-2">
          {isApplying ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon: Coupon) => (
              <div key={coupon.coupon_code} className="border p-2  bg-gray-100 rounded">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={coupon.coupon_code}
                    name="coupon"
                    value={coupon.coupon_code}
                    checked={selectedCoupon === coupon.coupon_code}
                    onChange={() => handleCouponSelect(coupon.coupon_code)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={coupon.coupon_code} className="font-bold">{coupon.coupon_code}</label>
                </div>
                <p className="text-sm text-gray-600 mx-3 mt-1">{coupon.coupon_description}</p>
                {selectedCoupon === coupon.coupon_code && (
                  <button 
                    className="text-red-500 text-sm font-PlusJakartaSans1000 mx-3 mt-2"
                    onClick={() => setSelectedCoupon(null)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          ) :(
            addedCoupon ? (
              <div key={addedCoupon.coupon_code} className="border p-2  bg-gray-100 rounded">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={addedCoupon.coupon_code}
                  name="coupon"
                  value={addedCoupon.coupon_code}
                  checked={selectedCoupon === addedCoupon.coupon_code}
                  onChange={() => handleCouponSelect(addedCoupon.coupon_code)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <label htmlFor={addedCoupon.coupon_code} className="font-bold">{addedCoupon.coupon_code}</label>
              </div>
              <p className="text-sm text-gray-600 mx-3 mt-1">{addedCoupon.coupon_description}</p>
              {selectedCoupon === addedCoupon.coupon_code && (
                <button 
                  className="text-red-500 text-sm font-PlusJakartaSans1000 mx-3 mt-2"
                  onClick={() => setSelectedCoupon(null)}
                >
                  Remove
                </button>
              )}
            </div>
            ) : (
              <div className="text-center text-gray-500">No available coupons</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default CouponSection;