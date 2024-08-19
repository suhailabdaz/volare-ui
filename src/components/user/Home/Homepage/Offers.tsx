import React, { useState, useEffect } from 'react';
import { useGetCouponsQuery } from '../../../../redux/apis/adminApiSlice';
import createAxios from '../../../../services/axios/UserAxios';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLongRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface Coupon {
  _id: string;
  coupon_code: string;
  coupon_description: string;
  coupon_image_link: string;
  discount: number;
  status: boolean;
}

function Offers() {
  const dispatch = useDispatch();
  const [offerType, setOfferType] = useState('All');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [images, setImages] = useState<{ [key: string]: string }>({});

  const { data, isLoading, error } = useGetCouponsQuery({});

  const fetchImage = async (imageLink: string): Promise<string> => {
    try {
      const response = await createAxios(dispatch).get<string>(
        airlineEndpoints.getImageLink,
        { params: { key:imageLink } }
      );
      return response.data; 
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  };

  const handleImageError = async (couponId: string, imageLink: string) => {
    try {
      const newImageSrc = await fetchImage(imageLink);
      setImages((prevImages) => ({
        ...prevImages,
        [couponId]: newImageSrc
      }));
    } catch (error) {
      console.error("Failed to refetch image:", error);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      // Set coupons data and fetch images
      setCoupons(data);
      const fetchAllImages = async () => {
        try {
          const imageFetchPromises = data.map(async (coupon: Coupon) => {
            const imageSrc = await fetchImage(coupon.coupon_image_link);
            return { id: coupon._id, imageSrc };
          });
          const fetchedImages = await Promise.all(imageFetchPromises);
          const imagesMap = fetchedImages.reduce((acc: { [key: string]: string }, { id, imageSrc }) => {
            acc[id] = imageSrc;
            return acc;
          }, {});
          setImages(imagesMap);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };
      fetchAllImages();
    }
  }, [data]);

  if (isLoading || error) {
    return <div>Loading...</div>;
  }

  // Filter coupons based on selected offer type
  const filteredCoupons = coupons.filter((coupon) =>
    offerType === 'All' ||offerType === 'Flights' || coupon.coupon_code === offerType
  );

  return (
    <div className="mx-[13%] shadow-[0_0_10px_rgba(0,0,0,0.2)] mt-10 p-6 border-2 rounded-lg">
      <div className=" mb-4 flex justify-between">
        <div className='flex justify-start space-x-12 items-center'>
        <h2 className="text-2xl font-PlusJakartaSans1000">Offers</h2>
        <div className="space-x-6 font-PlusJakartaSans text-lg font-bold">
          <button
            onClick={() => setOfferType('All')}
            className={`  rounded ${
              offerType === 'All' ? ' text-purple-600 font-PlusJakartaSans1000 ' : 'text-gray-600'
            }`}
          >
            <span>All</span>
           
          </button>
          <button
            onClick={() => setOfferType('Flights')}
            className={`rounded  ${
              offerType === 'Flights' ? ' text-purple-600 font-PlusJakartaSans1000' : 'text-gray-600'
            }`}
          >
            Flights
          </button>
          <button
            onClick={() => setOfferType('Hotels')}
            className={` rounded ${
              offerType === 'Hotels' ? ' text-purple-600 font-PlusJakartaSans1000' : 'text-gray-600'
            }`}
          >
            Hotels
          </button>
        </div>
        </div>
        <div className="flex items-center space-x-5 justify-center">
      <Link to={'/profile'} className='flex space-x-1 items-end justify-start'>
        <span className="font-PlusJakartaSans1000 text-purple-700 text-lg ">VIEW  ALL</span><ArrowLongRightIcon className='h-8 font-PlusJakartaSans1000 text-purple-700 text-lg '/>
      </Link>
      <div className="flex p-1 shadow-[0_0_10px_rgba(0,0,0,0.2)]  items-center  border-2 border-purple-200 rounded-2xl">
        <button className=" flex px-2 items-center justify-center border-r border-purple-500 text-purple-500 hover:text-gray-700">
          <ChevronLeftIcon className="h-6  w-6" />
        </button>
        <button className="flex items-center px-2 justify-center text-purple-500 hover:text-gray-700">
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
        
      </div>
      <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 font-PlusJakartaSans gap-4">
        {filteredCoupons.map((coupon) => (
          <div key={coupon._id} className="border rounded p-5  shadow-[0_0_10px_rgba(0,0,0,0.1)]">
            
            <div className='flex items-center justify-center space-x-4'>
            <img
              src={images[coupon._id] || 'placeholder-image-url'} // Placeholder if image not yet fetched
              alt={`Coupon ${coupon.coupon_code}`}
              className=" h-20 " 
              onError={() => handleImageError(coupon._id, coupon.coupon_image_link)}
            />
            <div className='space-y-1'>
            <h3 className="text-lg font-PlusJakartaSans1000 ">{coupon.coupon_code}</h3>
            <p className='text-sm'>{coupon.coupon_description}</p>
            <p className="text-sm text-gray-600">Discount: {coupon.discount}%</p>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Offers;
