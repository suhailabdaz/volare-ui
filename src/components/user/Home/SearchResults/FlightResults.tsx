import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSearchSchedulesQuery, useGetsearchAirlineQuery, useGetsearchFlightQuery } from '../../../../redux/apis/userApiSlice';
import ProfileShimmer from '../Shimmers/ProfileShimmer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import createAxios from '../../../../services/axios/AirlineAxios';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';

interface Params {
  from: string;
  to: string;
  weekday: string;
}

function Content() {
  const params = useParams() as unknown as Params;
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: boolean }>({});
  const dispatch = useDispatch();

  const selectedValue = useSelector((state: RootState) => state.HeroAuth.selectedValue);
  const classState = useSelector((state: RootState) => state.HeroAuth.classState);
  const fromAirport = useSelector((state: RootState) => state.HeroAuth.fromAirport);
  const toAirport = useSelector((state: RootState) => state.HeroAuth.toAirport);
  const departureDate = useSelector((state: RootState) => state.HeroAuth.departureDate);
  const returnDate = useSelector((state: RootState) => state.HeroAuth.returnDate);
  const travellers = useSelector((state: RootState) => state.HeroAuth.travellers);

  const { data: schedules, isLoading, error: dataError } = useGetSearchSchedulesQuery({
    from: params.from,
    to: params.to,
    weekday: params.weekday,
  }, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const fetchImages = async () => {
      if (schedules) {
        const imageKeys = new Set<string>();
        schedules.forEach((schedule: { airlineId: string }) => {
          const { data: airlineData } = useGetsearchAirlineQuery(schedule.airlineId, { skip: false });
          if (airlineData) {
            imageKeys.add(airlineData.airline_data.airline_image_link);
          }
        });

        imageKeys.forEach((key) => {
          if (!imageUrls[key]) {
            fetchImageUrl(key);
          }
        });
      }
    };

    fetchImages();
  }, [schedules, dispatch, imageUrls]);

  const fetchImageUrl = async (key: string) => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }));
      const response = await createAxios(dispatch).get(airlineEndpoints.getImageLink, { params: { key } });
      setImageUrls((prev) => ({ ...prev, [key]: response.data }));
      setLoading((prev) => ({ ...prev, [key]: false }));
      setError((prev) => ({ ...prev, [key]: false }));
    } catch (error) {
      console.error('Error fetching signed URL:', error);
      setError((prev) => ({ ...prev, [key]: true }));
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  if (isLoading) return <ProfileShimmer />;
  if (dataError) return <div>Error loading schedules. Please try again later.</div>;
  if (!schedules || schedules.length === 0) return <div>No schedules found for the selected criteria.</div>;

  return (
    <div className="flex justify-center font-PlusJakartaSans mt-14 mb-7" id="profile">
      <div className="bg-white w-[90%] shadow-custom rounded-xl border-l-4 border-l-gray-400">
        <div className="px-10 py-6">
          <div className="mt-8 text-gray-600 text-xs">
            <ul className="space-y-6">
              {schedules.map((schedule: any, index: any) => {
                const { data: airlineData, isLoading: isLoadingAirline } = useGetsearchAirlineQuery(schedule.airlineId, { refetchOnMountOrArgChange :true  });
                const { data: flightData, isLoading: isLoadingFlight } = useGetsearchFlightQuery(schedule.flightId, { refetchOnMountOrArgChange: true });

                if (isLoadingAirline || isLoadingFlight) return <ProfileShimmer key={index} />;
                return (
                  <li key={index}>
                    <div className="mb-4 flex space-x-10 items-center" onMouseEnter={()=>fetchImageUrl(airlineData?.airline_data.airline_image_link)}>
                      <div className='flex space-x-5 w-[20vh]'>
                        <div className={`border border-black h-12 w-12 flex items-center justify-center text-lg text-black font-bold bg-white`}>
                          {loading[airlineData?.airline_data.airline_image_link] ? (
                            <span>Loading...</span>
                          ) : error[airlineData?.airline_data.airline_image_link] ? (
                            <span>Error</span>
                          ) : (
                            <img 
                              src={imageUrls[airlineData?.airline_data.airline_image_link]}
                              alt={`${airlineData?.airline_data.airline_name} Logo`}
                              className="h-full w-full object-cover"
                              onError={() => fetchImageUrl(airlineData?.airline_data.airline_image_link)}
                            />
                          )}
                        </div>
                        <div className='items-center space-y-1'>
                          <div className="flex justify-center items-center">
                            <p className="font-extrabold text-sm text-black flex-1">{airlineData?.airline_data.airline_name}</p>
                          </div>
                          <div className="flex justify-center items-center ">
                            <p className="font-extrabold text-lg text-black flex-1">{flightData?.flight_data.flight_code}</p>
                          </div>
                        </div>
                      </div>
                      <div className="items-center ">
                        <p className="font-extrabold text-lg text-black flex-1">{schedule.departureTime}</p>
                        <p className="font-extrabold text-lg text-black flex-1">{fromAirport?.city}</p>
                      </div>
                      <div className="flex items-center border-b-4 border-b-green-600">
                        <span className="font-extrabold text-lg text-black flex-1">{schedule.duration}</span>
                      </div>
                      <div className="items-center ">
                        <p className="font-extrabold text-lg text-black flex-1">{schedule.arrivalTime}</p>
                        <p className="font-extrabold text-lg text-black flex-1">{toAirport?.city}</p>
                      </div>
                      <div className="items-center flex space-x-4 justify-end ">
                        <p className="font-extrabold text-sm text-black flex-1">Per Adult</p>
                        <p className="font-extrabold text-lg text-black flex-1">Rs.{schedule.economyPrice}</p>
                      </div>
                     
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
