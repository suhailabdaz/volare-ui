
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import ModalManager from './Modals/ModalManager';
import { PlusIcon } from '@heroicons/react/24/outline';
import createAxios from '../../../services/axios/AirlineAxios';
import { airlineEndpoints } from '../../../services/endpoints/AirlineEndpoints';
import { toast } from 'sonner';
import ListShimmer from './Shimmers/ListShimmer';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export interface CancellationPolicy{
  _id:string;
  policyName: string;
    firstPeriodPenalty: number;
    secondPeriodPenalty: number;
    thirdPeriodPenalty: number;
}

function CancelationList() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [cancellationPolicies,setCancellatioPolicies] = useState<CancellationPolicy[] | null>(null)

  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.AirlineAuth.isAuthenticated);
  const airlineData = useSelector((state: RootState) => state.AirlineAuth.airlineData);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(cancellationPolicies ? cancellationPolicies.length : 0 / itemsPerPage);

  useEffect(() => {
    const fetchCancelationData = async () => {
      try {
        if (authState && (!cancellationPolicies || cancellationPolicies.length === 0)) {
          const response = await createAxios(dispatch).get(airlineEndpoints.getCancelations, {
            params: {
              key: airlineData?._id,
            },
          });
          setCancellatioPolicies(response.data)
        }
      } catch (err) {
        toast.error("Error getting data");
      } finally {
        setIsLoading(false);
      }
    };

    if (authState) {
      fetchCancelationData();
    } else {
      setIsLoading(false);
    }
  }, [authState, airlineData?._id]);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
   
  };

  const closeModal = () => {
    setActiveModal(null);
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
  const currentPolicies = cancellationPolicies?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex mx-[11%] justify-center font-Durk_bold_italic_1000 my-7 bg-transparent text-white" id="myTravellers">
      <div className="w-[100%] shadow-custom border-2 border-white">
        <div className="px-10 py-6">
          <div className="flex justify-between">
            <div>
              <h1 className="font-extrabold text-3xl">Refund policies Details</h1>
              <p className="mt-1">Added ({cancellationPolicies?.length}) policies</p>
            </div>
            <div>
              <button
                className="text-xl font-bold p-2 border-2 border-white"
                onClick={() => openModal('addCancelation')}
              >
                <div className="flex">
                  <PlusIcon className="h-4" />
                  <span>Add Policy</span>
                </div>
              </button>
            </div>
          </div>
          <div className="mt-8 text-gray-600 text-xs">
            <ul className="space-y-6">
              {currentPolicies?.map((policy: CancellationPolicy, index: number) => (
                <li key={policy._id} className="mb-4 group">
                  <div className="relative flex items-center text-white">
                    <div className="font-bold mx-4 text-xl">{startIndex + index + 1}. </div>
                    <div className={`border-2 p-1 border-white flex items-center text-lg justify-center text-white font-bold bg-transparent`}>
                      policy name: {policy.policyName?.toUpperCase()}
                    </div>
                    <div className="ml-28 flex space-x-12 justify-center items-center">
                      <div className="font-bold text-base">
                        First Penalty: {policy.firstPeriodPenalty}
                      </div>
                      <div className="font-bold text-base">
                      Second Penalty: {policy.secondPeriodPenalty}
                      </div>
                      <div className="font-bold text-base">
                      Third Penalty: {policy.thirdPeriodPenalty}
                      </div>
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
      />
    </div>
  );
}



export default CancelationList