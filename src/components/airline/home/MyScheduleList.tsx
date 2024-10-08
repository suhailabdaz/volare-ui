import { useEffect, useState } from 'react';
import ModalManager from './Modals/ModalManager';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import ListShimmer from './Shimmers/ListShimmer';
import { useGetMySchedulesQuery, useGetAirportDetailsQuery } from '../../../redux/apis/airlineApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

function MySchedulesList() {

  // Define the interfaces
  interface Airport {
    _id: string;
    airport_name: string;
    airport_code: string;
    city: string;
    country: string;
  }

  interface Schedule {
    _id: string;
    fromAirport_Id: string;
    toAirport_Id: string;
    arrivalTime: string;
    duration: string;
    departureTime: string;
    status: boolean;
    available: boolean;
    daysOfWeek: string[];
  }

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const schedulesPerPage = 5;

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [stateAirports, setStateAirports] = useState<Airport[] | null>(null);
  const [fromAirport, setfromAirport] = useState<Airport | null>(null);
  const [toAirport, settoAirport] = useState<Airport | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean | null>(false);

  const airlineId = useSelector((state: RootState) => state.AirlineAuth.airlineData?._id);
  const { data, isLoading, error } = useGetMySchedulesQuery(airlineId, {
    refetchOnMountOrArgChange: true,
  });

  const { data: airportData, isLoading: airportIsLoading, error: airportError } = useGetAirportDetailsQuery({}, {
    pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!airportIsLoading && !airportError && airportData?.airports) {
      setStateAirports(airportData.airports);
    }
  }, [airportData?.airports, airportIsLoading, airportError]);

  useEffect(() => {
    if (!data || !Array.isArray(data)) {
      setIsEmpty(true);
    } else {
      setIsEmpty(data.length === 0);
    }
  }, [data]);

  const openModal = (modalName: string, schedule: Schedule | null = null, fromAirport: Airport | null, toAirport: Airport | null) => {
    setActiveModal(modalName);
    if (schedule) {
      setSelectedSchedule(schedule);
      setfromAirport(fromAirport);
      settoAirport(toAirport);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedSchedule(null);
  };

  const getAirportById = (id: string | null) => {
    if (Array.isArray(stateAirports) && id) {
      return stateAirports.find(airport => airport._id === id) || null;
    }
    return null;
  };

  const dayAbbreviations: { [key: string]: string } = {
    Sunday: 'Sun',
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
  };

  const formatDaysOfWeek = (daysOfWeek: string[]) => {
    return daysOfWeek.map(day => dayAbbreviations[day] || day).join(', ');
  };

  // Pagination logic
  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
  const currentSchedules = data?.slice(indexOfFirstSchedule, indexOfLastSchedule);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <ListShimmer />;
  }

  if (error) {
    console.error('Error:', error);
    return <div>Error occurred:</div>;
  }

  return (
    <div className="flex mx-[11%] justify-center font-Durk_bold_italic_1000 my-7 bg-transparent text-white" id="myTravellers">
      <div className="w-[100%] shadow-custom border-2 border-white">
        <div className="px-10 py-6">
          <div className="flex justify-between">
            <div>
              {isEmpty ? (
                <h1 className="font-extrabold text-3xl">No Schedules Available</h1>
              ) : (
                <h1 className="font-extrabold text-3xl">Airline Schedules</h1>
              )}
              <p className="mt-1">({data.length}) Schedules</p>
            </div>
          </div>
          <div className="mt-8 text-gray-600 text-xs">
            <ul className="space-y-6">
              {currentSchedules?.map((schedule: any, index: number) => {
                const fromAirport = getAirportById(schedule.fromAirport_Id);
                const toAirport = getAirportById(schedule.toAirport_Id);

                return (
                  <li key={schedule._id} className="mb-4 group">
                    <div className="relative flex items-center text-white">
                      <div className="font-bold mx-4 text-xl">{index + 1 + indexOfFirstSchedule}. </div>
                      <div className="flex items-center">
                        <div className="flex">
                          <div className="border-2 border-white h-8 w-16 flex items-center text-sm justify-center text-white font-bold">
                            {fromAirport ? fromAirport.airport_code : 'Unknown'}
                          </div>
                          <div className="mx-2 text-lg font-bold">
                            <ArrowRightCircleIcon className="h-8" />
                          </div>
                          <div className="border-2 border-white h-8 w-16 flex items-center text-sm justify-center text-white font-bold">
                            {toAirport ? toAirport.airport_code : 'Unknown'}
                          </div>
                        </div>
                        <div className="mx-4">
                          <div className="font-bold text-sm">
                            {fromAirport ? fromAirport.airport_name : 'Unknown'} - {toAirport ? toAirport.airport_name : 'Unknown'}
                          </div>
                          <div className="text-white-400 text-[0.6rem]">
                            Departure: {schedule.departureTime} | Arrival: {schedule.arrivalTime} | Duration: {schedule.duration} | Days: <span className="font-bold">{formatDaysOfWeek(schedule.daysOfWeek)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200">
                        <button onClick={() => openModal('bookSchedule', schedule, fromAirport, toAirport)}>
                          <span className="p-2 border border-white invisible text-lg font-semibold group-hover:visible">
                            Enquire
                          </span>
                        </button>
                      </div>
                    </div>
                    <hr className="border-gray-300 mt-2" />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`mx-2 px-3 py-1 border ${currentPage === 1 ? 'border-gray-500' : 'border-white'}`}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastSchedule >= data.length}
              className={`mx-2 px-3 py-1 border ${indexOfLastSchedule >= data.length ? 'border-gray-500' : 'border-white'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ModalManager
        activeModal={activeModal || ''}
        closeModal={closeModal}
        openModal={openModal}
        schedule={selectedSchedule || ''}
        fromAirport={fromAirport}
        toAirport={toAirport}
      />
    </div>
  );
}

export default MySchedulesList;
