import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import ProfileShimmer from './AuthShimmer';
import {
  useBlockAirlineMutation,
  useGetAirlinesQuery,
} from '../../../redux/apis/authorityApiSlice';
import createAxios from '../../../services/axios/AuthorityAxios';
import { airlineEndpoints } from '../../../services/endpoints/AirlineEndpoints';
import ConfirmModal from './Modals/ConfirModal';

interface AirlineData {
  _id: string;
  airline_code: string;
  airline_name: string;
  airline_email:string;
  status?: boolean;
  airline_image_link: string;
}

function AirlinesList() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectAirlineId, setAirlineId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: boolean }>({});
  const couponsPerPage = 4;
  const dispatch = useDispatch();
  const [blockAirline] = useBlockAirlineMutation();

  const {
    data,
    isLoading,
    error: cError,
    refetch,
  } = useGetAirlinesQuery('airline',
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const fetchImageUrl = async (key: string) => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }));
      const response = await createAxios(dispatch).get(
        airlineEndpoints.getImageLink,
        {
          params: { key },
        }
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
    if(data && data.airlines){
      data.airlines.forEach((Airline: AirlineData) => {
        if (Airline.airline_image_link) {
          fetchImageUrl(Airline.airline_image_link);
        }
      });
    }
  }, [data]);

  const handleImageError = (key: string) => {
    fetchImageUrl(key);
  };

  const getRandomGradient = () => {
    const gradients = ['bg-gradient-to-r from-white to-white-500'];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (!data || !data.airlines || isLoading) {
    return <ProfileShimmer />;
  }

  if (cError) {
    return <ProfileShimmer />;
  }

  const totalPages = Math.ceil(data.airlines.length / couponsPerPage);
  const startIndex = (currentPage - 1) * couponsPerPage;
  const paginatedAirlines = data.airlines?.slice(startIndex, startIndex + couponsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const ShowConfirm = async (id: string) => {
    setAirlineId(id);
    setShowConfirmModal(true);
  };

  const handleBlock = async () => {
    try {
      await blockAirline({ Id:selectAirlineId }).unwrap();
      refetch();
      toast.message('Airline Status Changed', {
        className:
          'border-2 border-black font-PlusJakartaSans1000 bg-gray-100 rounded-none',
      });
    } catch {
      toast.error('task failed');
    }
  };

  return (
    <div
      className="flex mx-[11%] justify-center font-PlayfairDisplay my-7 bg-transparent"
      id="myTravellers"
    >
      <div className="w-[100%] shadow-custom border-2 border-black">
        <div className="px-10 py-6">
          <div className="flex justify-between">
            <div>
              <h1 className="font-extrabold text-3xl text-black">
                Airlines List
              </h1>
              <p className="mt-1">Currently: ({data.airlines.length}) Airlines</p>
            </div>
          </div>
          <div className="mt-8 text-gray-600 text-xs">
            <ul className="space-y-6">
              {paginatedAirlines.map((airline: AirlineData, index: any) => (
                <li key={airline._id} className="mb-4 group">
                  <div className="relative flex items-center text-black">
                    <div className="font-bold mx-4 text-xl">
                      {startIndex + index + 1}.{' '}
                    </div>
                    <div
                      className={`border-2 border-black h-16 w-16 flex items-center text-lg justify-center text-black font-bold ${getRandomGradient()}`}
                    >
                      {loading[airline.airline_image_link] ? (
                        <div className="flex-col gap-4 w-full flex items-center justify-center">
                          <div className="w-7 h-7 border-4 border-transparent text-gray-300 text-4xl animate-spin flex items-center justify-center border-t-gray-300 rounded-full">
                            <div className="w-5 h-5 border-4 border-transparent text-gray-300 text-2xl animate-spin flex items-center justify-center border-t-gray-300 rounded-full"></div>
                          </div>
                        </div>
                      ) : error[airline.airline_image_link] ? (
                        <span>Error</span>
                      ) : (
                        <img
                          src={imageUrls[airline.airline_image_link]}
                          alt={`${airline.airline_code} Logo`}
                          className="h-full w-full object-cover"
                          onError={() =>
                            handleImageError(airline.airline_image_link)
                          }
                        />
                      )}{' '}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-PlusJakartaSans1000 text-lg">
                        {airline.airline_code}
                      </div>
                      <div className="font-bold text-sm">
                        {airline.airline_name}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-bold text-lg">
                        {airline.airline_email}
                      </div>
                    </div>
                    <div className="absolute right-10 flex items-start space-x-2 transition-all duration-300 delay-200">
                      <div className="text-base pr-24 font-semibold text-left">
                        {airline.status ? 'Active' : 'Blocked'}
                      </div>
                      <button onClick={() => ShowConfirm(airline._id)}>
                        <span className="p-1 border border-black invisible text-base font-bold text-black-500 group-hover:visible">
                          {airline.status ? 'Block' : 'UnBlock'}
                        </span>
                      </button>
                    </div>
                    {showConfirmModal && (
                      <ConfirmModal
                        message="Are You sure You want to continue ?"
                        onConfirm={() => {
                          handleBlock();
                          setShowConfirmModal(false);
                        }}
                        onCancel={() => setShowConfirmModal(false)}
                        cancelLabel="Cancel"
                        confirmLabel="Continue"
                      />
                    )}
                  </div>
                  <hr className="border-gray-300 mt-2" />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`m-5 px-2 py-2 font-bold bg-gray-300 text-black rounded-full ${
                currentPage === 1 && 'opacity-50 cursor-not-allowed'
              }`}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-6 font-bold" />
            </button>
            <div className="text-base font-semibold">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`m-5 px-2 py-2 font-bold bg-gray-300 text-black rounded-full ${
                currentPage === totalPages && 'opacity-50 cursor-not-allowed'
              }`}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-6 font-bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirlinesList;
