import  { SetStateAction, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store'; 
import ModalManager from '../../authority/home/Modals/ModalManager';
import { PlusIcon } from '@heroicons/react/24/outline';
import  AuthShimmer from './AuthShimmer';
import { setAirports as setAirs } from '../../../redux/slices/authoritySlice';
import { authorityEndpoints } from '../../../services/endpoints/AuthorityEndpoints';
import createAxios from '../../../services/axios/AuthorityAxios';
import { toast } from 'sonner';
import { ChevronLeftIcon,ChevronRightIcon } from '@heroicons/react/24/solid';
interface Airport {
  _id: string;
  airport_code: string;
  airport_name: string;
  city: string;
  country: string;
  status:boolean;
}

function AirportList()  {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedAirportId, setSelectedAirportId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authState = useSelector((state: RootState) => state.AuthorityAuth.isAuthenticated);
  const dispatch = useDispatch();
  const [airports, setAirports] = useState<Airport[] | null>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  
  const airportsData = useSelector((state: RootState)=>state.AuthorityAuth.airports)
 
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


 

  useEffect(() => {
    const fetchAirportsData = async()=>{
      try{
        setIsLoading(true)
          if(authState){
            const response = await createAxios(dispatch).get(authorityEndpoints.getAirports, {
              params: {
                page: currentPage,
                limit: itemsPerPage
              }
            });
            setAirports(response.data.pageAirports);
            setTotalPages(response.data.totalPages);
            dispatch(setAirs(response.data.airports));
          }
      }catch(err){
        toast.error("Error getting data");
      } finally {
        setIsLoading(false);
      }
    }
    if(authState){
      fetchAirportsData();
    }else{
      setIsLoading(false);
    }
   
  }, [authState, dispatch,currentPage]);

  if (isLoading) {
    return <AuthShimmer />;
  }


  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };


  return (
    <div className='flex mx-[11%] justify-center font-PlayfairDisplay my-7 bg-transparent'>
      <div className='w-[100%] shadow-custom border-2 border-black'>
        <div className='px-10 py-6'>
          <div className='flex justify-between'>
            <div>
              <h1 className='font-extrabold text-3xl text-black'>Airport List</h1>
              <p className='mt-1'>Added ({airportsData.length}) Airports</p>
            </div>
            <div>
              <button className="text-xl font-bold p-2 border-2 border-black" onClick={() => openModal('addAirport')}>
                <div className='flex'><PlusIcon className='h-4' /><span>Add Airport</span></div>
              </button>
            </div>
          </div>
          <div className='mt-8 text-gray-600 text-xs'>
            <ul className='space-y-6'>
              {airports && airports.map((airport, index) => (
                <li key={airport._id} className='mb-4 group'>
                  <div className='relative flex items-center text-black'>
                    <div className='font-bold mx-4 text-xl'>{(currentPage - 1) * itemsPerPage + index + 1}.</div>
                    <div className={`border-2 border-black h-8 w-12 flex items-center text-lg justify-center text-black font-bold bg-white`}>
                      {airport.airport_code?.charAt(0).toUpperCase()}{airport.airport_code?.charAt(1).toUpperCase()}{airport.airport_code?.charAt(2).toUpperCase()}
                    </div>
                    <div className='ml-4 flex-1'>
                      <div className='font-bold text-base'>{airport.airport_name}</div>
                    </div>
                    <div className='absolute right-8 flex justify-end items-center space-x-2 transition-all duration-300 delay-200'>
                      <div className='text-base pr-28 font-semibold'>{airport.city}</div>
                      <div className='text-base pr-12 font-semibold'>{airport.country}</div>
                      <div className='text-base pr-28 font-semibold'>{airport.status?'Active':'Suspended'}</div>
                      <button onClick={() => openModal('viewAirport', airport._id)}>
                        <span className='p-1 border border-black invisible text-base font-bold text-black-500 group-hover:visible'>View details</span>
                      </button>
                    </div>
                  </div>
                  <hr className="border-gray-300 mt-2" />
                </li>
              ))}
            </ul>
          </div>
          <div className='flex justify-center items-center px-4'>
            <button 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(currentPage - 1)}
              className=' m-5 px-2 py-2 font-bold bg-gray-300 text-black rounded-full disabled:opacity-50'
            >
              <ChevronLeftIcon className='h-6 font-bold'/>
            </button>
            <div className='text-center'>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(currentPage + 1)}
              className='m-5 px-2 py-2 font-bold bg-gray-300 rounded-full text-black  disabled:opacity-50'
            >
              <ChevronRightIcon className='h-6 font-bold'/>
            </button>
          </div>
        </div>
      </div>
      <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} airportId={selectedAirportId || ""} />
    </div>
  );
}

export default AirportList


