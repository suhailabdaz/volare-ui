import {
  ArrowRightCircleIcon,
  PencilIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ProfileDetails from './ProfileDetails';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { useEffect, useState } from 'react';
import createAxios from '../../../services/axios/AirlineAxios';
import { airlineEndpoints } from '../../../services/endpoints/AirlineEndpoints';

function HomeContent() {
  const navigate = useNavigate();
  const airlineData = useSelector(
    (state: RootState) => state.AirlineAuth.airlineData
  );
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchImageUrl = async () => {
    try {
      const response = await createAxios().get(airlineEndpoints.getImageLink, {
        params: {
          key: airlineData?.airline_image_link,
        },
      });
      console.log(response);

      setImageUrl(response.data);
      setLoading(false);
      setError(false);
    } catch (error) {
      console.error('Error fetching signed URL:', error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (airlineData?.airline_image_link) {
      fetchImageUrl();
    }
  }, [airlineData]);

  const handleImageError = async () => {
    try {
      await fetchImageUrl(); // Retry fetching the image URL
    } catch (error) {
      console.error('Error retrying signed URL fetch:', error);
    }
  };

  const splitText = (text: string) => {
    if (text.includes(' ')) {
      // Split by space if spaces are present
      const parts = text.split(' ');
      const firstPart = parts.slice(0, -1).join(' ');
      const secondPart = parts.slice(-1).join(' ');
      return { firstPart, secondPart };
    } else {
      // Split by length if no spaces are present
      const midIndex = Math.ceil(text.length / 2);
      const firstPart = text.slice(0, midIndex);
      const secondPart = text.slice(midIndex);
      return { firstPart, secondPart };
    }
  };
  const { firstPart, secondPart } = splitText(airlineData?.airline_name || '');

  return (
    <div className="mx-[11%] pt-8 pb-3 h-[30%]  bg-transparent font-PlayfairDisplay">
      <div className="mt-5 flex justify-start">
        <div className="mb-4 bg-transparent border-2 border-white w-[17%] rounded-xl h-44 flex justify-center items-center relative">
          {loading ? (
            // Show a loading spinner or some placeholder while loading
            <div>Loading...</div>
          ) : error || !imageUrl ? (
            // Show default icon or error state
            <div>
              <UserIcon className="text-white h-16" />
            </div>
          ) : (
            // Show the fetched image
            <img
              src={imageUrl}
              alt="Airline Profile"
              className="h-full w-full  rounded-xl object-fit"
              onError={handleImageError}
            />
          )}
          <button></button>
        </div>

        <div className="font-Durk_bold_italic_1000 ml-12 relative flex  justify-start items-start">
          <h1 className="text-white text-[160px] leading-tight -mt-3">
            {firstPart}
          </h1>
          <h1
            className="text-transparent text-[160px] leading-tight -mt-3"
            style={{ WebkitTextStroke: '2px white' }}
          >
            {secondPart}
          </h1>
        </div>
      </div>
      <div className="flex justify-between">
        <ProfileDetails />
        <div>
          <div className="mx-12 flex space-x-6 mt-16 text-white font-Durk_bold_400 py-6">
            <button
              onClick={() => navigate('/airline/flights')}
              className="text-xl font-bold p-2 rounded-2xl border-2  border-white h-16 transition-all hover:scale-105 delay-100 duration-500"
            >
              <div className="flex items-center space-x-4">
                <span>Air Fleet</span> <ArrowRightCircleIcon className="h-6" />{' '}
              </div>
            </button>
            <button
              onClick={() => navigate('/airline/schedules')}
              className="text-xl font-bold p-2 rounded-2xl border-2 border-white h-16 transition-all hover:scale-105 delay-100 duration-500"
            >
              <div className="flex items-center space-x-2">
                <span>Schedules</span> <ArrowRightCircleIcon className="h-6" />{' '}
              </div>
            </button>
          </div>
          <div className="mx-12 flex space-x-6  text-white font-Durk_bold_400 py-6">
            <button
              onClick={() => navigate('/airline/flights')}
              className="text-xl font-bold p-2 rounded-2xl border-2  border-white h-16 transition-all hover:scale-105 delay-100 duration-500"
            >
              <div className="flex items-center space-x-4">
                <span>Analytics</span> <ArrowRightCircleIcon className="h-6" />{' '}
              </div>
            </button>
            <button
              onClick={() => navigate('/airline/schedules')}
              className="text-xl font-bold p-2 rounded-2xl border-2 border-white h-16 transition-all hover:scale-105 delay-100 duration-500"
            >
              <div className="flex items-center space-x-2">
                <span>LOGOUT</span> <ArrowRightCircleIcon className="h-6" />{' '}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeContent;
