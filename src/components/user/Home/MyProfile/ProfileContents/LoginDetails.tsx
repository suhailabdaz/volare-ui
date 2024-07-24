import  { useState } from 'react'
import AddMobileButton from '../../../../buttons/AddMobileButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store/store';
import ModalManager from './EditModals/ModalManager';



function ProfileDetails()  {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const userData = useSelector((state: RootState) => state.ProfileAuth.userData);


  const closeModal = () => {
    setActiveModal(null);
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
  };

  return (
    <div className='flex justify-center font-PlusJakartaSans  mb-7 ' id='loginDetails'>
    <div className='bg-white w-[90%] shadow-custom rounded-xl border-l-4 border-l-gray-400'>
      <div className='px-10 py-6'>
        <div className='flex justify-between'>
          <div>
          <h1 className='font-extrabold text-3xl text-black'>Login Details</h1>
          <p className='mt-1'>Manage your email address mobile number and password</p>
          </div>
    
        </div>
          <div className=' mt-8  text-gray-600 text-xs'>
            <ul className='space-y-6'>
              <li>
                <div className='flex mb-3 items-center w-[50%]'>
                  <span className='font-normal flex-1'>MOBILE NUMBER</span>
                  <span className='font-extrabold text-lg text-black flex-1 '>{userData?.mobile ? userData.mobile.toString() : <AddMobileButton openModal={openModal} modalName='addMobile'/>}</span>
                </div> 
                <hr className="border-gray-300 " />
              </li>
              <li>
                <div className='flex mb-3 items-center w-[50%]'>
                  <span className='font-normal flex-1'>E-MAIL</span>
                  <span className='font-extrabold text-sm text-black flex-1'>{userData?.email }</span>
                </div>
                <hr className="border-gray-300 " />
              </li>
              <li className='flex justify-between'>
                <div className='flex mb-4 items-center w-[50%]'>
                  <span className='font-normal flex-1'>PASSWORD</span>
                  <span className='font-extrabold text-sm text-black flex-1 '>* * * * * * *</span>
                </div>
                <button onClick={()=>openModal('passwordEdit')}><span className='text-base font-bold text-blue-500'>Change password ?</span></button>
              </li>
              
            </ul>
          </div>
      </div>
    </div>
    <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} />
    </div>
  )
}

export default ProfileDetails