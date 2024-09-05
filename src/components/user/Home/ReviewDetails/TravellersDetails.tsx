import React, { useState, useEffect } from 'react';
import createAxios from '../../../../services/axios/UserAxios';
import { userEndpoints } from '../../../../services/endpoints/UserEndpoints';
import { RootState } from '../../../../redux/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { setTravellers } from '../../../../redux/slices/travellersSlice';
import ModalManager from './Modals/ModalManager';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
interface TravellerData {
  _id: any;
}

interface TravellersDetailsProps {
  onUpdateTravellers: (updatedTravellers: any[]) => void;
  travellerType: {
    adults: number;
    children: number;
    infants: number;
  };
  bookingDetails: {
    travellers: TravellerData[];
  };
}

const TravellersDetails: React.FC<TravellersDetailsProps> = ({
  onUpdateTravellers,
  travellerType,
  bookingDetails,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTravellerId, setSelectedTravellerId] = useState<string | null>(null);
  const [selectedTravellers, setSelectedTravellers] = useState<string[]>([]);

  const dispatch = useDispatch();
  const totalTravellers =
    travellerType.adults + travellerType.children + travellerType.infants;

  const userState = useSelector((state: RootState) => state.UserAuth.userData);
  const travellersData = useSelector(
    (state: RootState) => state.TravellerAuth.travellers
  );

  useEffect(() => {
    const fetchTravellersData = async () => {
      try {
        if (userState && (!travellersData || travellersData.length === 0)) {
          const response = await createAxios(dispatch).get(
            userEndpoints.getTravellers,
            {
              params: { id: userState._id },
            }
          );
          dispatch(setTravellers(response.data.travellers));
        }
      } catch (err) {
        toast.error('Error getting data');
      }
    };

    if (userState && (!travellersData || travellersData.length === 0)) {
      fetchTravellersData();
    }
  }, [userState, dispatch, travellersData]);

  useEffect(() => {
    if (bookingDetails && bookingDetails.travellers.length) {
      const travellerIds = bookingDetails.travellers.map(traveller => traveller._id);
      setSelectedTravellers(travellerIds);
    }
  }, [bookingDetails]);


  const openModal = (modalName: string, travellerId: string | null = null) => {
    setActiveModal(modalName);
    if (travellerId) {
      setSelectedTravellerId(travellerId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTravellerId(null);
  };

  const handleAddTraveller = () => {
    openModal('addTraveller');
  };

  const handleTravellerSelection = (travellerId: string) => {
    setSelectedTravellers((prev) => {
      let newSelected;
      if (prev.includes(travellerId)) {
        newSelected = prev.filter((id) => id !== travellerId);
      } else if (prev.length < totalTravellers) {
        newSelected = [...prev, travellerId];
      } else {
        toast.error(`You can only select up to ${totalTravellers} travellers.`);
        return prev;
      }
      
      const selectedTravellersData = travellersData.filter((traveller) =>
        newSelected.includes(traveller._id)
      );
      onUpdateTravellers(selectedTravellersData);
      return newSelected;
    });
  };

  

  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-r from-green-400 to-blue-500',
      'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
      'bg-gradient-to-r from-yellow-400 to-red-500',
      'bg-gradient-to-r from-blue-400 to-indigo-500',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const truncateEmail = (email: string, maxLength: number) => {
    return email.length > maxLength ? email.slice(0, maxLength) + '...' : email;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderTravellerItem = (traveller: any, isSelected: boolean = false) => (
    <div className="relative flex items-center text-black mb-4">
      {!isSelected && (
        <input
          type="checkbox"
          id={`traveller-${traveller._id}`}
          checked={selectedTravellers.includes(traveller._id)}
          onChange={() => handleTravellerSelection(traveller._id)}
          className="hidden peer"
        />
      )}

      {!isSelected && (
        <label
          htmlFor={`traveller-${traveller._id}`}
          className="cursor-pointer mx-4 block rounded-full w-5 h-5 border-2 border-gray-300 peer-checked:border-[6px] peer-checked:border-blue-600 peer-checked:bg-white peer-checked:after:text-white peer-checked:after:block peer-checked:after:text-center peer-checked:after:font-bold peer-checked:after:absolute peer-checked:after:w-full peer-checked:after:h-full peer-checked:after:leading-6"
        ></label>
      )}
      <div
        className={`rounded-full h-8 w-8 flex items-center text-xs justify-center text-white font-bold ${getRandomGradient()}`}
      >
        {traveller.firstName?.charAt(0).toUpperCase()}
        {traveller.lastName?.charAt(0).toUpperCase()}
      </div>
      <div className="ml-4 flex-1">
        <div className="font-bold text-base">
          {traveller.firstName} {traveller.lastName}
          <div className="flex font-light text-sm">
            <div className="mr-1">{traveller.gender},</div>
            <div>{formatDate(traveller.dateOfBirth)}</div>
          </div>
        </div>
      </div>
      <div className="absolute right-4 flex items-start space-x-2 transition-all duration-300 delay-200">
        <div className="text-xs pr-16 font-semibold">
          {truncateEmail(traveller.email, 15)}
        </div>
        <div className="text-xs pr-12 font-semibold">
          +91-{traveller.phone}
        </div>
        {!isSelected && (
          <button
            onClick={() => openModal('editTraveller', traveller._id)}
          >
            <span className="invisible text-sm font-bold text-blue-500 group-hover:visible">
              View details
            </span>
          </button>
        )}
        {isSelected && (
          <button
            onClick={() => handleTravellerSelection(traveller._id)}
            className="text-black"
          >
            <XMarkIcon className="h-5 hover:transform hover:scale-[2] hover:text-red-500 transition-all duration-200 delay-10" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="bg-white z-0 rounded w-[99%] shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5"
      id="travellers"
    >
      <div className="flex justify-between mb-5">
        <h1 className="font-PlusJakartaSans1000 text-xl">Travellers Details</h1>
        <h1 className="font-PlusJakartaSans1000">
          {selectedTravellers.length}/{totalTravellers}{' '}
          <span className="text-gray-500 font-bold text-sm mx-2">Selected</span>
        </h1>
      </div>

      {/* Selected Travellers Section */}
      {selectedTravellers.length > 0 && (
        <div className="mb-8 bg-gray-100 p-4 rounded-lg">
          <h2 className="font-PlusJakartaSans1000 text-lg mb-4">Selected Travellers</h2>
          {travellersData
            .filter((traveller) => selectedTravellers.includes(traveller._id))
            .map((traveller) => (
              <div key={`selected-${traveller._id}`} className="mb-2 last:mb-0">
                {renderTravellerItem(traveller, true)}
              </div>
            ))}
        </div>
      )}

      {/* All Travellers Section */}
      <h2 className="font-PlusJakartaSans1000 text-lg mb-4">All Travellers</h2>
      <ul className="space-y-6">
        {travellersData &&
          travellersData.map((traveller) => (
            <li key={traveller._id} className="mb-4 group">
              {renderTravellerItem(traveller)}
              <hr className="border-gray-300 mt-2" />
            </li>
          ))}
      </ul>

      <div className="flex justify-end space-x-8 mt-4 mx-4">
        <button
          onClick={handleAddTraveller}
          className="text-blue-600 font-bold py-2 px-4 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Traveller
        </button>
        {/* <button
          onClick={handleDone}
          disabled={selectedTravellers.length !== totalTravellers}
          className={`${
            selectedTravellers.length === totalTravellers
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed'
          } px-6 py-1 text-white rounded-2xl font-PlusJakartaSans1000 text-md`}
        >
          Done
        </button> */}
      </div>

      <ModalManager
        activeModal={activeModal || ''}
        closeModal={closeModal}
        openModal={openModal}
        travellerId={selectedTravellerId || ''}
      />
    </div>
  );
};

export default TravellersDetails;