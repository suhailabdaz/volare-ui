import { useEffect, useState } from 'react';
import ModalManager from './Modals/ModalManager';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import ListShimmer from './Shimmers/ListShimmer';
import {
  useGetFreeSchedulesQuery,useGetAirportDetailsQuery} from '../../../redux/apis/airlineApiSlice';

function FreeSchedulesList() {

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
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [stateAirports, setStateAirports] = useState<Airport[] | null>(null);

  const [fromAirport, setfromAirport] = useState<Airport | null>(null);

  const [toAirport, settoAirport] = useState<Airport | null>(null);



  const [isEmpty, setIsEmpty] = useState<boolean | null>(false);

  const { data, isLoading, error } = useGetFreeSchedulesQuery(
    {},
    {
      pollingInterval: 60000,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data:airportData, isLoading:airportIsLoading, error:airportError } = useGetAirportDetailsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  useEffect(() => {
    if (!airportIsLoading && !airportError && airportData?.airports) {
      setStateAirports(airportData.airports); 
    }
  }, [airportData?.airports, airportIsLoading, airportError]);


  useEffect(() => {
    if (!data || !Array.isArray(data)) {
      setIsEmpty(true);
    }else{
      setIsEmpty(data.length==0)
    }
  }, [data]);

  const openModal = (modalName: string, schedule: Schedule | null = null,fromAirport:Airport | null,toAirport:Airport | null) => {
    setActiveModal(modalName);
    if (schedule) {
      setSelectedSchedule(schedule);
      setfromAirport(fromAirport)
      settoAirport(toAirport)
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

  if (isLoading ) {
    return <ListShimmer />;
  }

  if (error ) {
    console.error('Error:', error);
    return <div>Error occurred:</div>;
  }

  return (
    <div
      className="flex mx-[11%]  justify-center font-Durk_bold_italic_1000 my-7 bg-transparent text-white "
      id="myTravellers"
    >
      <div className="w-[100%] shadow-custom border-2 border-white">
        <div className="px-10 py-6">
          <div className="flex justify-between">
            <div>
              {isEmpty ? (
                <h1 className="font-extrabold text-3xl">No Schedules Available</h1>
              ) : (
                <h1 className="font-extrabold text-3xl">Available Schedules</h1>)
              }
              <p className="mt-1">({data.length}) Schedules Available</p>
            </div>
            
   
          </div>
          <div className="mt-8 text-gray-600 text-xs">
            <ul className="space-y-6">
            {data.map((schedule: any, index: number) => {
  const fromAirport = getAirportById(schedule.fromAirport_Id);
  const toAirport = getAirportById(schedule.toAirport_Id);

  return (
    <li key={schedule._id} className="mb-4 group">
      <div className="relative flex items-center text-white">
        <div className="font-bold mx-4 text-xl">{index + 1}. </div>
  
        <div className=" flex items-center">
          <div className='flex'>
          <div className='border-2 border-white h-8 w-16 flex items-center text-sm justify-center text-white font-bold'>
                        {fromAirport ? fromAirport.airport_code : 'Unknown'}
                      </div>
                      <div className='mx-2 text-lg font-bold'><ArrowRightCircleIcon className='h-8'/></div>
                      <div className='border-2 border-white h-8 w-16 flex items-center text-sm justify-center text-white font-bold'>
                        {toAirport ? toAirport.airport_code : 'Unknown'}
                      </div>
          </div>
          <div className='mx-4'>
          <div className="font-bold text-sm ">
            {fromAirport ? fromAirport.airport_name : 'Unknown'} - {toAirport ? toAirport.airport_name : 'Unknown'}
          </div>
          <div className="text-white-400 text-[0.6rem]">
            Departure: {schedule.departureTime} | Arrival: {schedule.arrivalTime} | Duration: {schedule.duration} | Days: <span className="font-bold">{formatDaysOfWeek(schedule.daysOfWeek)}</span>
          </div>
          </div>
          
        </div>
        <div className="absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200">
          <button onClick={() => openModal('bookSchedule', schedule,fromAirport,toAirport)}>
            <span className="p-2 border border-white invisible text-lg font-semibold  group-hover:visible">
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

export default FreeSchedulesList;


