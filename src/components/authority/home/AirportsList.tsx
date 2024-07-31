import  { useState } from 'react'
import AddTravellerButton from '../../buttons/AddTravellerModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store'; 
import ModalManager from '../../authority/home/Modals/ModalManager';
import { PlusIcon } from '@heroicons/react/24/outline';



function AirportList()  {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedAirportId, setSelectedAirportId] = useState<string | null>(null);
  
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


  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
  };

  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-r from-white to-white-500',

    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const truncateEmail = (email:any, maxLength:number) => {
    return email.length > maxLength ? email.slice(0, maxLength) + '...' : email;
  }
  

  return (
    <div className='flex mx-[11%]  justify-center font-PlayfairDisplay my-7 bg-transparent ' id='myTravellers'>
    <div className=' w-[100%] shadow-custom border-2 border-black'>
      <div className='px-10 py-6'>
        <div className='flex justify-between'>
          <div>
          <h1 className='font-extrabold text-3xl text-black'>Airport List</h1>
          <p className='mt-1'>Added ({airportsData.length}) Airports</p>
          </div>
           <div>
           <button className="text-xl font-bold p-2 border-2 border-black" onClick={()=>openModal('addAirport')}><div className='flex'><PlusIcon className='h-4'/><span>Add Airport</span></div></button>
           </div>
        </div>
          <div className=' mt-8  text-gray-600 text-xs'>
            <ul className='space-y-6'>
            {airportsData.map((airport:any,index:any) => (
        <li key={airport._id} className='mb-4 group'>
        <div className='relative flex items-center text-black'>
        <div className='font-bold  mx-4 text-xl'>{ index+ 1}.  </div>
          <div className={`border-2 border-black h-8 w-12 flex items-center text-lg justify-center text-black font-bold ${getRandomGradient()}`}>
            {airport.airport_code?.charAt(0).toUpperCase()}{airport.airport_code?.charAt(1).toUpperCase()}{airport.airport_code?.charAt(2).toUpperCase()}
          </div>
          <div className='ml-4 flex-1'>
            
            <div className='font-bold text-base'>
            {airport.airport_name}
            </div>
          </div>
          {/* Add a wrapper div with fixed width for consistent alignment */}
          <div className='absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200'>
          <div className=' text-base pr-28 font-semibold'>{truncateEmail(airport.city, 15)}</div>
            <div className=' text-base pr-12 font-semibold'> {airport.country}</div>
            <button onClick={()=>openModal('viewAirport',airport._id)} >
            <span className='  p-1 border border-black invisible text-base font-bold text-black-500 group-hover:visible '>View details</span>            </button>
          </div>
        </div>
        <hr className="border-gray-300 mt-2" />
      </li>
      ))}
            </ul>
          </div>
      </div>
    </div>
    <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} airportId={selectedAirportId||""} />
    </div>
  )
}

export default AirportList


