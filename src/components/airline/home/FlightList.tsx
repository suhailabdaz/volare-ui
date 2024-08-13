import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import ModalManager from './Modals/ModalManager';
import { PlusIcon } from '@heroicons/react/24/outline';
import createAxios from '../../../services/axios/AirlineAxios';
import { airlineEndpoints } from '../../../services/endpoints/AirlineEndpoints';
import { setFlights } from '../../../redux/slices/airlineSlice';
import { toast } from 'sonner';
import ListShimmer from './Shimmers/ListShimmer';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function FlightList() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.AirlineAuth.isAuthenticated);
  const airlineData = useSelector((state: RootState) => state.AirlineAuth.airlineData);
  const flightData = useSelector((state: RootState) => state.AirlineAuth.fleet);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(flightData.length / itemsPerPage);

  useEffect(() => {
    const fetchFlightsData = async () => {
      try {
        if (authState && (!flightData || flightData.length === 0)) {
          const response = await createAxios(dispatch).get(airlineEndpoints.getFlights, {
            params: {
              key: airlineData?._id,
            },
          });
          dispatch(setFlights(response.data.flights));
        }
      } catch (err) {
        toast.error("Error getting data");
      } finally {
        setIsLoading(false);
      }
    };

    if (authState) {
      fetchFlightsData();
    } else {
      setIsLoading(false);
    }
  }, [authState, dispatch, airlineData?._id, flightData]);

  const openModal = (modalName: string, flightId: string | null = null) => {
    setActiveModal(modalName);
    if (flightId) {
      setSelectedFlightId(flightId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedFlightId(null);
  };

  const calculateTotalSeats = (flight: any) => {
    return flight.economy_seats + flight.business_seats + flight.first_class_seats;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return <ListShimmer />;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFlights = flightData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex mx-[11%] justify-center font-Durk_bold_italic_1000 my-7 bg-transparent text-white" id="myTravellers">
      <div className="w-[100%] shadow-custom border-2 border-white">
        <div className="px-10 py-6">
          <div className="flex justify-between">
            <div>
              <h1 className="font-extrabold text-3xl">Fleet Details</h1>
              <p className="mt-1">Added ({flightData.length}) Flights</p>
            </div>
            <div>
              <button
                className="text-xl font-bold p-2 border-2 border-white"
                onClick={() => openModal('addFlight')}
              >
                <div className="flex">
                  <PlusIcon className="h-4" />
                  <span>Add Flight</span>
                </div>
              </button>
            </div>
          </div>
          <div className="mt-8 text-gray-600 text-xs">
            <ul className="space-y-6">
              {currentFlights.map((flight: any, index: number) => (
                <li key={flight._id} className="mb-4 group">
                  <div className="relative flex items-center text-white">
                    <div className="font-bold mx-4 text-xl">{startIndex + index + 1}. </div>
                    <div className={`border-2 p-1 border-white flex items-center text-lg justify-center text-white font-bold bg-transparent`}>
                      {flight.flight_code?.toUpperCase()}
                    </div>
                    <div className="ml-28 flex-1">
                      <div className="font-bold text-base">
                        {flight.manufacturer}
                      </div>
                    </div>
                    <div className="absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200">
                      <div className="text-base mr-36 font-semibold">
                        Total Seats: {calculateTotalSeats(flight)}
                      </div>
                      <div className="text-base mr-36 font-semibold">
                        {flight.status ? 'Active' : 'Suspended'}
                      </div>
                      <button onClick={() => openModal('viewFlightDetails', flight._id)}>
                        <span className="p-1 border border-white invisible text-base font-bold text-black-500 group-hover:visible">
                          View details
                        </span>
                      </button>
                    </div>
                  </div>
                  <hr className="border-gray-300 mt-2" />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className={`text-lg font-bold p-2 ${currentPage === 1 ? 'text-gray-400' : 'text-white'} `}
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
            >
              <ChevronLeftIcon className='h-10 '/>
            </button>
            <span className="text-lg font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`text-lg font-bold p-2 ${currentPage === totalPages ? 'text-gray-400' : 'text-white'}`}
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              <ChevronRightIcon className='h-10'/>
              </button>
          </div>
        </div>
      </div>
      <ModalManager
        activeModal={activeModal || ''}
        closeModal={closeModal}
        openModal={openModal}
        flightId={selectedFlightId || ''}
      />
    </div>
  );
}

export default FlightList;
