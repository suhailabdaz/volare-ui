import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import ModalManager from './Modals/ModalManager';
import createAxios from '../../../services/axios/AdminAxios';
import { airlineEndpoints } from '../../../services/endpoints/AirlineEndpoints';

interface AirlineData {
  _id: string;
  airline_email: string;
  airline_code: string;
  airline_name: string;
  status?: boolean;
  airline_image_link: string;
}

const AirlineList: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedAirlineId, setSelectedAirlineId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: boolean }>({});

  const airlineData = useSelector((state: RootState) => state.AdminAuth.airlines);

  const openModal = (modalName: string, airlineId: string | null = null) => {
    setActiveModal(modalName);
    if (airlineId) {
      setSelectedAirlineId(airlineId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedAirlineId(null);
  };

  const fetchImageUrl = async (key: string) => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }));
      const response = await createAxios().get(airlineEndpoints.getImageLink, {
        params: { key },
      });
      setImageUrls((prev) => ({ ...prev, [key]: response.data }));
      setLoading((prev) => ({ ...prev, [key]: false }));
      setError((prev) => ({ ...prev, [key]: false }));
    } catch (error) {
      console.error('Error fetching signed URL:', error);
      setError((prev) => ({ ...prev, [key]: true }));
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    airlineData.forEach((airline: AirlineData) => {
      if (airline.airline_image_link) {
        fetchImageUrl(airline.airline_image_link);
      }
    });
  }, [airlineData]);

  const handleImageError = (key: string) => {
    fetchImageUrl(key);
  };

  const getRandomGradient = () => {
    const gradients = ['bg-gradient-to-r from-white to-white-500'];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const truncateEmail = (email: string, maxLength: number) => {
    return email.length > maxLength ? email.slice(0, maxLength) + '...' : email;
  };

  return (
    <div className='flex mx-[11%] justify-center font-PlayfairDisplay my-7 bg-transparent' id='myTravellers'>
      <div className='w-[100%] shadow-custom border-2 border-black'>
        <div className='px-10 py-6'>
          <div className='flex justify-between'>
            <div>
              <h1 className='font-extrabold text-3xl text-black'>Airlines List</h1>
              <p className='mt-1'>Currently: ({airlineData.length}) Airlines</p>
            </div>
          </div>
          <div className='mt-8 text-gray-600 text-xs'>
            <ul className='space-y-6'>
              {airlineData.map((airline: AirlineData, index: number) => (
                <li key={airline._id} className='mb-4 group'>
                  <div className='relative flex items-center text-black'>
                    <div className='font-bold mx-4 text-xl'>{index + 1}. </div>
                    <div className={`border border-black h-12 w-12 flex items-center justify-center text-lg text-black font-bold ${getRandomGradient()}`}>
                      {loading[airline.airline_image_link] ? (
                        <span>Loading...</span>
                      ) : error[airline.airline_image_link] ? (
                        <span>Error</span>
                      ) : (
                        <img
                          src={imageUrls[airline.airline_image_link]}
                          alt={`${airline.airline_name} Logo`}
                          className="h-full w-full object-cover"
                          onError={() => handleImageError(airline.airline_image_link)}
                        />
                      )}
                    </div>
                    <div className='ml-4 flex'>
                      <div className='font-extrabold text-2xl'>
                        {airline.airline_code}
                      </div>
                    </div>
                    <div className='ml-44 flex'>
                      <div className='font-bold text-base'>
                        {airline.airline_name}
                      </div>
                    </div>
                    <div className='absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200'>
                      <div className='text-base pr-12 font-semibold text-left'>{truncateEmail(airline.airline_email, 20)}</div>
                      <div className='text-base pr-12 font-semibold text-left'>
                        {airline.status ? 'Active' : 'Suspended'}
                      </div>
                      <button onClick={() => openModal('viewAirline', airline._id)}>
                        <span className='p-1 border border-black invisible text-base font-bold text-black-500 group-hover:visible'>View details</span>
                      </button>
                    </div>
                  </div>
                  <hr className="border-gray-300 mt-2" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} userId={selectedAirlineId || ""} />
    </div>
  );
};

export default AirlineList;
