import  { useState } from 'react'
import AddTravellerButton from '../../../../buttons/AddTravellerModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store/store';
import ModalManager from './EditModals/ModalManager';




function ProfileDetails()  {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTravellerId, setSelectedTravellerId] = useState<string | null>(null);
  


  const travellersData = useSelector((state: RootState)=>state.TravellerAuth.travellers)



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


  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
  };

  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-r from-green-400 to-blue-500',
      'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
      'bg-gradient-to-r from-yellow-400 to-red-500',
      'bg-gradient-to-r from-blue-400 to-indigo-500'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const truncateEmail = (email:any, maxLength:number) => {
    return email.length > maxLength ? email.slice(0, maxLength) + '...' : email;
  }

 
  

  return (
    <div className='flex justify-center  font-PlusJakartaSans mb-7 ' id='myTravellers'>
    <div className='bg-white w-[90%] shadow-custom rounded-xl border-l-4 border-l-gray-400'>
      <div className='px-10 py-6'>
        <div className='flex justify-between'>
          <div>
          <h1 className='font-extrabold text-3xl text-black'>Save Traveller(s)</h1>
          <p className='mt-1'>You have (0) Traveller(s)</p>
          </div>
           <div>
            <AddTravellerButton openModal={openModal} modalName='traveller'/>
           </div>
        </div>
          <div className=' mt-8  text-gray-600 text-xs'>
            <ul className='space-y-6'>
            {travellersData.map(traveller => (
        <li key={traveller._id} className='mb-4 group'>
        <div className='relative flex items-center text-black'>
          <div className={`rounded-full h-12 w-12 flex items-center justify-center text-white font-bold ${getRandomGradient()}`}>
            {traveller.firstName?.charAt(0).toUpperCase()}{traveller.lastName?.charAt(0).toUpperCase()}
          </div>
          <div className='ml-4 flex-1'>
            <div className='font-bold text-base'>
              {traveller.firstName} {traveller.lastName}
              <div className='flex font-light text-sm'>
                <div className='mr-1'>{traveller.gender},</div>
                <div>{formatDate(traveller.dateOfBirth)}</div>
              </div>
            </div>
          </div>
          {/* Add a wrapper div with fixed width for consistent alignment */}
          <div className='absolute  right-4 flex items-start space-x-2 transition-all duration-300 delay-200'>
          <div className=' text-xs pr-16 font-semibold'>{truncateEmail(traveller.email, 15)}</div>
            <div className=' text-xs pr-12 font-semibold'>+91-{traveller.phone}</div>
            <button onClick={()=>openModal('viewTraveller',traveller._id)} >
            <span className='  invisible text-sm font-bold text-blue-500 group-hover:visible '>View details</span>            </button>
          </div>
        </div>
        <hr className="border-gray-300 mt-2" />
      </li>
      ))}
            </ul>
          </div>
      </div>
    </div>
    <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} travellerId={selectedTravellerId||""} />
    </div>
  )
}

export default ProfileDetails