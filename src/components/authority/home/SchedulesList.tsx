import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { setSchedule, setSchedules } from '../../../redux/slices/authoritySlice';
import ModalManager from '../../authority/home/Modals/ModalManager';
import { PlusIcon } from '@heroicons/react/24/outline';
import { createAxios } from '../../../services/axios/AuthorityAxios';
import { authorityEndpoints } from '../../../services/endpoints/AuthorityEndpoints';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface AirportOption {
  value: string;
  label: string;
}

interface SchedulesListProps {
  toAirport: AirportOption | null;
  fromAirport: AirportOption | null;
}

const SchedulesList: React.FC<SchedulesListProps> = ({ fromAirport, toAirport }) => {
  const dispatch = useDispatch();
  const [fromAirportstate, setFromAirport] = useState<AirportOption | null>(fromAirport);
  const [toAirportstate, setToAirport] = useState<AirportOption | null>(toAirport);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedAirportId, setSelectedAirportId] = useState<string | null>(null);

  const schedules = useSelector((state: RootState) => state.AuthorityAuth.schedules);
  const airports = useSelector((state: RootState) => state.AuthorityAuth.airports);

  const getAirportById = (id: string | null) => {
    return airports.find(airport => airport._id === id) || null;
  };



  const fetchSchedules = async () => {
    if (fromAirport && toAirport) {
      try {
        const response = await createAxios(dispatch).get(authorityEndpoints.getSchedules, {
          params: {
            fromAirportId: fromAirport.value,
            toAirportId: toAirport.value,
          },
        });
        dispatch(setSchedules(response.data.schedules));
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [fromAirportstate, toAirportstate]);

  const openModal = (modalName: string, airportId: string | null = null) => {
    setActiveModal(modalName);
    if (airportId) {
      setSelectedAirportId(airportId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedAirportId(null);
  };

  const suspendSchedule = async (id:string) =>{
    try {
      const response = await createAxios(dispatch).post(authorityEndpoints.suspendSchedule, id);
      if (response.data.success) {
        dispatch(setSchedule(response.data.schedule));
        toast.success('Saved Successfully');
      } else {
        toast.error('Error while saving');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    }
  }

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

  return (
    <div className='flex mx-[11%] justify-center font-PlayfairDisplay my-7 bg-transparent' id='myTravellers'>
      <div className='w-[100%] shadow-custom border-2 border-black'>
        <div className='px-10 py-6'>
          <div className='flex justify-between'>
            <div>
              <h1 className='font-extrabold text-3xl text-black'>Schedules List</h1>
              <p className='mt-1'>Added ({schedules.length}) Schedules between these Airports</p>
            </div>
            <div>
              <button className="text-xl font-bold p-2 border-2 border-black" onClick={() => openModal('scheduleAdd')}>
                <div className='flex'><PlusIcon className='h-4' /><span>Add Schedule</span></div>
              </button>
            </div>
          </div>
          <div className='mt-8 text-gray-600 text-xs'>
            {schedules.length === 0 ? (
              <p>No schedules added for this route</p>
            ) : (
              <ul className='space-y-6'>
                {schedules.map((schedule, index) => {
                  const fromAirport = getAirportById(schedule.fromAirport_Id);
                  const toAirport = getAirportById(schedule.toAirport_Id);

                  return (
                    <li key={schedule._id} className='mb-4 group'>
                      <div className='relative flex items-center text-black'>
                        <div className='font-bold mx-4 text-xl'>{index + 1}.  </div>
                        <div className='border-2 border-black h-8 w-24 flex items-center text-lg justify-center text-black font-bold'>
                          {fromAirport ? fromAirport.airport_code : 'Unknown'}
                        </div>
                        <div className='mx-4 text-lg font-bold'><ArrowRightCircleIcon className='h-8'/></div>
                        <div className='border-2 border-black h-8 w-24 flex items-center text-lg justify-center text-black font-bold'>
                          {toAirport ? toAirport.airport_code : 'Unknown'}
                        </div>
                        <div className='ml-4 flex-1'>
                          <div className='font-bold text-base'>
                            {fromAirport ? fromAirport.airport_name : 'Unknown'} - {toAirport ? toAirport.airport_name : 'Unknown'}
                          </div>
                          <div className='text-sm text-gray-800'>
                            Departure: {schedule.departureTime} | Arrival: {schedule.arrivalTime} | Duration: {schedule.duration} | Days:<span className='font-bold '> {formatDaysOfWeek(schedule.daysOfWeek)}</span>
                          </div>
                        </div>
                        <div className='absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200'>
                          <button onClick={() => suspendSchedule(schedule._id)}>
                            <span className='p-1 border border-black invisible text-base font-bold text-black-500 group-hover:visible'>Suspend Schedule</span>
                          </button>
                        </div>
                      </div>
                      <hr className="border-gray-300 mt-2" />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
      <ModalManager
        activeModal={activeModal || ''}
        closeModal={closeModal}
        openModal={openModal}
        airportId={selectedAirportId || ""}
        from={fromAirportstate?.label.slice(0, 3) || ''}
        to={toAirportstate?.label.slice(0, 3 || '')}
        fromAirport={fromAirportstate}
        toAirport={toAirportstate}
      />
    </div>
  );
};

export default SchedulesList;
