import { useState } from 'react';
import AddTravellerButton from '../../buttons/AddTravellerModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import ModalManager from './Modals/ModalManager';
import { PlusIcon } from '@heroicons/react/24/outline';

function FlightList() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedFlightId, setSelectedFlighttId] = useState<string | null>(
    null
  );

  const flightData = useSelector((state: RootState) => state.AirlineAuth.fleet);

  const openModal = (modalName: string, flightId: string | null = null) => {
    setActiveModal(modalName);
    if (flightId) {
      setSelectedFlighttId(flightId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedFlighttId(null);
  };

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
  };

  const calculateTotalSeats = (flight: any) => {
    return (
      flight.economy_seats + flight.business_seats + flight.first_class_seats
    );
  };

  return (
    <div
      className="flex mx-[11%]  justify-center font-Durk_bold_italic_1000 my-7 bg-transparent text-white "
      id="myTravellers"
    >
      <div className=" w-[100%] shadow-custom border-2 border-white">
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
          <div className=" mt-8  text-gray-600 text-xs">
            <ul className="space-y-6">
              {flightData.map((flight: any, index: any) => (
                <li key={flight._id} className="mb-4 group">
                  <div className="relative flex items-center  text-white">
                    <div className="font-bold  mx-4 text-xl">{index + 1}. </div>
                    <div
                      className={`border-2 p-1 border-white  flex items-center text-lg justify-center text-white font-bold bg-transparent`}
                    >
                      {flight.flight_code?.toUpperCase()}
                    </div>

                    <div className="ml-28 flex-1">
                      <div className="font-bold text-base ">
                        {flight.manufacturer}
                      </div>
                    </div>
                    {/* Add a wrapper div with fixed width for consistent alignment */}
                    <div className="absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200">
                      <div className=" text-base mr-36 font-semibold">
                        total Seats: {calculateTotalSeats(flight)}
                      </div>
                      <div className="text-base mr-36 font-semibold">
                        {flight.status ? 'Active' : 'Suspended'}
                      </div>{' '}
                      <button
                        onClick={() =>
                          openModal('viewFlightDetails', flight._id)
                        }
                      >
                        <span className="  p-1 border border-white invisible text-base font-bold text-black-500 group-hover:visible ">
                          View details
                        </span>{' '}
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
