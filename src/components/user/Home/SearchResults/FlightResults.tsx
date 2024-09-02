import  { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import userApi, {
  useGetSearchSchedulesQuery,
  useGetsearchAirportsQuery,
  useGetsearchFlightQuery,
} from '../../../../redux/apis/userApiSlice';
import { useGetAirlinesQuery } from '../../../../redux/apis/authorityApiSlice';
import ProfileShimmer from '../Shimmers/SearchresShimmer';
import ErrorComponent from '../Shimmers/SearchresError';
import createAxios from '../../../../services/axios/AirlineAxios';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';
import RupeeIcoon from '../../../../assets/images/icons8-rupee-24.png';
import ModalManager from './Modals/ModalManager';
import FilterSort from './FilterSort';
import SortComponent from './SortComponent';

interface Params {
  from: string;
  to: string;
  date: string;
  class: string;
}

export interface FlightInstance {
  _id?: string;
  scheduleId: string;
  flightId: string;
  airlineId: string;
  departureDate: Date;
  arrivalDate: Date;
  fromAirport_Id: string;
  toAirport_Id: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
  availableSeats: {
    economy: number;
    business: number;
    firstClass: number;
  };
  currentPrices: {
    economy: number;
    business: number;
    firstClass: number;
  };
  seatLayout: {
    economyClass: Row[];
    businessClass: Row[];
    firstClass: Row[];
  };
}

interface Seat {
  number: string;
  position: 'window' | 'middle' | 'aisle';
  isAvailable: boolean;
  userId?: string;
}

interface Row {
  row: number;
  seats: Seat[];
}

function Content() {
  const params = useParams() as unknown as Params;
  const dispatch = useDispatch();

  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, boolean>>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedAirlines, setSelectedAirlines] = useState();
  const [selectedFlight, setSelectedFlight] = useState();
  const [selectedSchedule, setSelectedScehdule] = useState();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [sortedSchedules, setSortedSchedules] = useState<FlightInstance[]>([]);
  const [classState, setClassState] = useState(params.class);
  const [filteredSchedules, setFilteredSchedules] = useState<FlightInstance[]>([]);

  const {
    data: schedules,
    isLoading: schedulesLoading,
    error: schedulesError,
  } = useGetSearchSchedulesQuery(
    { from: params.from, to: params.to, date: params.date },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: airportData,
    isLoading: airportLoading,
    error: airportError,
  } = useGetsearchAirportsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: airlineDetails,
    isLoading: airlineLoading,
    error: airlineError,
  } = useGetAirlinesQuery('airline', {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: flightDetails,
    isLoading: flightLoading,
    error: flightError,
  } = useGetsearchFlightQuery({}, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    return () => {
      dispatch(
        userApi.util.invalidateTags([
          'searchSchedules',
          'searchAirline',
          'searchAirports',
          'searchFlights',
        ])
      );
    };
  }, [dispatch]);

  useEffect(() => {
    setIsPageLoading(true)
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [params]);

  useEffect(() => {
    if (schedules && airlineDetails) {
      const fetchImages = async () => {
        const imageKeys = new Set<string>();
        schedules.forEach((schedule: { airlineId: string | number }) => {
          const airlineData = airlineDetails.airlines.find(
            (airline: { _id: string | number }) => airline._id === schedule.airlineId
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
      };
      fetchImages();
    }
  }, [schedules, airlineDetails, imageUrls]);

  useEffect(() => {
    setClassState(params.class);
  }, [params]);

  useEffect(() => {
    if (schedules) {
      setSortedSchedules(schedules);
      setFilteredSchedules(schedules);
    }
  }, [schedules]);

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

  const handleSortChange = (sortedData: FlightInstance[]) => {
    setSortedSchedules(sortedData);
  };

  const handleFilterChange = (filters: any) => {
    
  const filtered = schedules.filter((schedule: FlightInstance) => {
  const departureHour = parseInt(schedule.departureTime.split(':')[0], 10);
  const arrivalHour = parseInt(schedule.arrivalTime.split(':')[0], 10);
  const getPrice = (cls: string): number => {
    switch (cls.toLowerCase()) {
      case 'economy':
        return schedule.currentPrices.economy;
      case 'business':
        return schedule.currentPrices.business;
      case 'firstclass':
        return schedule.currentPrices.firstClass;
      default:
        console.error(`Invalid class state: ${cls}`);
        return 0; 
    }
  };

  const price = getPrice(classState);
  return (
    (!filters.departureTime || 
      (filters.departureTime === 'early' && departureHour >= 6 && departureHour < 12) ||
      (filters.departureTime === 'noon' && departureHour >= 12 && departureHour < 18) ||
      (filters.departureTime === 'late' && (departureHour >= 18 || departureHour < 6))) &&
    (!filters.arrivalTime || 
      (filters.arrivalTime === 'early' && arrivalHour >= 6 && arrivalHour < 12) ||
      (filters.arrivalTime === 'noon' && arrivalHour >= 12 && arrivalHour < 18) ||
      (filters.arrivalTime === 'late' && (arrivalHour >= 18 || arrivalHour < 6)))
      &&
      (price >= filters.priceRange[0] && price <= filters.priceRange[1])
  );
});

    setFilteredSchedules(filtered);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const handleView = (schedule: any, airline: any, flight: any) => {
    openModal('ticketTypes');
    setSelectedAirlines(airline);
    setSelectedScehdule(schedule);
    setSelectedFlight(flight);
  };

  if (
    isPageLoading ||
    schedulesLoading ||
    airportLoading ||
    airlineLoading ||
    flightLoading
  ) {
    return <ProfileShimmer />;
  }

  if (schedulesError || airportError || airlineError || flightError) {
    console.error(
      'Error fetching data:',
      schedulesError || airportError || airlineError || flightError
    );
    return (
      <div className="w-full">
        <ErrorComponent />
      </div>
    );
  }

  if (
    !schedules ||
    schedules.length === 0 ||
    !airportData ||
    !airlineDetails ||
    !flightDetails
  ) {
    return (
      <div className="w-full">
        <ErrorComponent />
      </div>
    );
  }

  return (
    <div className="flex w-full justify-evenly">
      <div className="w-1/4">
        <FilterSort schedules={schedules} onFilterChange={handleFilterChange} />
      </div>
      <div className="font-PlusJakartaSans mb-7 w-3/4">
        <SortComponent scheduleData={filteredSchedules} onSortChange={handleSortChange} />
        <ul className="space-y-2">
        {airportData?.airports &&
            Array.isArray(flightDetails) &&
            Array.isArray(airportData.airports) &&
            airlineDetails?.airlines &&
            Array.isArray(airlineDetails.airlines) &&
            Array.isArray(sortedSchedules) &&
            sortedSchedules.length > 0 &&
            sortedSchedules.map(
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
                  (airport: { _id: any }) =>
                    airport._id === schedule.toAirport_Id
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
                                <img
                                  src={RupeeIcoon}
                                  alt="Rs"
                                  className="h-4"
                                />
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
                          imageURLs={imageUrls}
                        />
                      </div>
                    </div>
                  </li>
                );
              }
            )}
                    </ul>
      </div>
    </div>
  );
}

export default Content; 