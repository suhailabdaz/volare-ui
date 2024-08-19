import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetSearchSchedulesQuery,
  useGetsearchAirportsQuery,
  useGetsearchFlightQuery,
} from '../../../../redux/apis/userApiSlice';
import ProfileShimmer from '../Shimmers/SearchresShimmer';
import ErrorComponent from '../Shimmers/SearchresError';

import { useDispatch } from 'react-redux';
import createAxios from '../../../../services/axios/AirlineAxios';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';
import { useGetAirlinesQuery } from '../../../../redux/apis/authorityApiSlice';
import RupeeIcoon from '../../../../assets/images/icons8-rupee-24.png';
import ModalManager from './Modals/ModalManager';

interface Params {
  from: string;
  to: string;
  date: string;
  class: string;
}

function Content() {
  const params = useParams() as unknown as Params;
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedAirlines, setSelectedAirlines] = useState();
  const [selectedFlight, setSelectedFlight] = useState();
  const [selectedSchedule, setSelectedScehdule] = useState();

  const closeModal = () => {
    setActiveModal(null);
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const [classState, setClassState] = useState(params.class);

  const {
    data: schedules,
    isLoading,
    error: dataError,
    refetch,
  } = useGetSearchSchedulesQuery(
    { from: params.from, to: params.to, date: params.date },
    { refetchOnMountOrArgChange: true }
  );

  const { data: airportData, error: airportError } = useGetsearchAirportsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: airlineDetails, isLoading: airlineLoading, error: airlineError } = useGetAirlinesQuery('airline', {
    refetchOnMountOrArgChange: true,
    pollingInterval: 6000
  });
  console.log('Airline Query:', { data: airlineDetails, isLoading: airlineLoading, error: airlineError });
  
  const { data: flightDetails, isLoading: flightLoading, error: flightError } = useGetsearchFlightQuery(
    {},
    { refetchOnMountOrArgChange: true, pollingInterval: 6000 }
  );
  console.log('Flight Query:', { data: flightDetails, isLoading: flightLoading, error: flightError });

  useEffect(() => {
    const fetchImages = async () => {
      if (schedules && airlineDetails) {
        const imageKeys = new Set<string>();

        schedules.forEach((schedule: { airlineId: string | number }) => {
          const airlineData = airlineDetails.airlines.find(
            (airline: { _id: string | number }) =>
              airline._id === schedule.airlineId
          );
          if (airlineData?.airline_image_link) {
            imageKeys.add(airlineData.airline_image_link);
          }
        });

        for (const key of imageKeys) {
          if (!imageUrls[key]) {
            fetchImageUrl(key);
          }
        }
      }
    };

    fetchImages();
  }, [schedules, airlineDetails, imageUrls]);

  const fetchImageUrl = async (key: string) => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }));
      const response = await createAxios(dispatch).get(
        airlineEndpoints.getImageLink,
        { params: { key } }
      );
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
    setClassState(params.class);
  }, [params]);

  if (isLoading) {
    return <ProfileShimmer />;
  }

  if (dataError || airportError) {
    console.error(
      'Error fetching schedules or airport data:',
      dataError || airportError
    );
    return (
      <div>
        <ErrorComponent fetch={refetch} />
      </div>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <div>
        <ErrorComponent fetch={refetch} />
      </div>
    );
  }

  const handleView = (schedule: any, airline: any, flight: any) => {
    openModal('ticketTypes');
    setSelectedAirlines(airline);
    setSelectedScehdule(schedule);
    setSelectedFlight(flight);
  };

  return (
    <div className="font-PlusJakartaSans mb-7">
      <ul className="space-y-2">
        {airportData?.airports &&
          Array.isArray(flightDetails) &&
          Array.isArray(airportData.airports) &&
          airlineDetails?.airlines &&
          Array.isArray(airlineDetails.airlines) &&
          Array.isArray(schedules) &&
          schedules.length > 0 &&
          schedules.map(
            (
              schedule: {
                currentPrices: any;
                fromAirport_Id: any;
                toAirport_Id: any;
                airlineId: string | number;
                flightId: string | number;
                departureTime:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | null
                  | undefined;
                duration:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | null
                  | undefined;
                arrivalTime:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | null
                  | undefined;
              },
              index: Key | null | undefined
            ) => {
              const fromAirport = airportData.airports.find(
                (airport: { _id: any }) =>
                  airport._id === schedule.fromAirport_Id
              );
              const toAirport = airportData.airports.find(
                (airport: { _id: any }) => airport._id === schedule.toAirport_Id
              );

              const airlineData = airlineDetails.airlines.find(
                (airline: { _id: string | number }) =>
                  airline._id === schedule.airlineId
              );
              const flightData = flightDetails.find(
                (flight: { _id: string | number }) =>
                  flight._id === schedule.flightId
              );

              return (
                <li key={index}>
                  <div className="flex justify-center font-PlusJakartaSans ">
                    <div className="bg-white w-[90%] shadow-custom rounded-lg">
                      <div className="px-10 py-6">
                        <div className="mb-4 flex space-x-10 items-center">
                          <div className="flex space-x-5 w-[20vh]">
                            <div className=" h-10 w-10 flex items-center justify-center text-lg text-black font-bold bg-white">
                              {loading[airlineData?.airline_image_link] ? (
                                <span>Loading...</span>
                              ) : error[airlineData?.airline_image_link] ? (
                                <span>Error</span>
                              ) : (
                                <img
                                  src={
                                    imageUrls[airlineData?.airline_image_link]
                                  }
                                  alt={`${airlineData?.airline_name} Logo`}
                                  className="h-full w-full object-cover"
                                  onError={() =>
                                    fetchImageUrl(
                                      airlineData?.airline_image_link
                                    )
                                  }
                                />
                              )}
                            </div>
                            <div className="items-center space-y-1">
                              <div className="flex justify-center items-center">
                                <p className="font-extrabold text-xs text-black flex-1">
                                  {airlineData?.airline_name}
                                </p>
                              </div>
                              <div className="flex justify-center items-center">
                                <p className="font-extrabold text-bse text-black flex-1">
                                  {flightData?.flight_code}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="items-center">
                            <p className="font-extrabold text-sm text-black flex-1">
                              {schedule.departureTime}
                            </p>
                            <p className="font-extrabold text-lg text-black flex-1">
                              {fromAirport?.city}
                            </p>
                          </div>
                          <div className="flex items-center border-b-4 border-b-green-600">
                            <span className="font-extrabold text-base text-black flex-1">
                              {schedule.duration}
                            </span>
                          </div>
                          <div className="items-center">
                            <p className="font-extrabold text-sm text-black flex-1">
                              {schedule.arrivalTime}
                            </p>
                            <p className="font-extrabold text-lg text-black flex-1">
                              {toAirport?.city}
                            </p>
                          </div>
                          <div className="items-center mx-3">
                            <p className="font-extrabold text-xs text-black flex-1">
                              Per Adult
                            </p>
                            <p className="font-extrabold text-lg text-black items-center justify-center flex">
                              <img src={RupeeIcoon} alt="Rs" className="h-4" />
                             
                              {/* Debugging the prices */}
                              {classState === 'Economy'
                                ? schedule?.currentPrices?.economy
                                : classState === 'Business'
                                ? schedule?.currentPrices?.business
                                : classState === 'FirstClass'
                                ? schedule?.currentPrices?.firstClass
                                : 'N/A'}{' '}
                              {/* Added 'N/A' as fallback for clarity */}
                            </p>
                          </div>
                          <div className="items-end mx-3">
                            <button
                              onClick={() =>
                                handleView(schedule, airlineData, flightData)
                              }
                              className="bg-purple-100 border border-purple-700 hover:scale-105 transition-all duration-300  rounded-2xl "
                            >
                              <p className="px-3 py-2 text-purple-800 text-sm font-PlusJakartaSans1000">
                                View Details
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                      <ModalManager
                        activeModal={activeModal || ''}
                        closeModal={closeModal}
                        airlineData={selectedAirlines}
                        flightData={selectedFlight}
                        scheduleData={selectedSchedule}
                        fromAirport={fromAirport}
                        toAirport={toAirport}
                        imageURLs = {imageUrls}
                      />
                    </div>
                  </div>
                </li>
              );
            }
          )}
      </ul>
    </div>
  );
}

export default Content;
