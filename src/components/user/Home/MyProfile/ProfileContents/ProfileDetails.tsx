import  { useState } from 'react'
import EditButton from '../../../../buttons/EditButton';
import AddButton from '../../../../buttons/AddButton';
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
    <div className='flex justify-center font-PlusJakartaSans mt-14 mb-7 ' id='profile'>
    <div className='bg-white w-[90%] shadow-custom rounded-xl border-l-4 border-l-gray-400'>
      <div className='px-10 py-6'>
        <div className='flex justify-between'>
          <div>
          <h1 className='font-extrabold text-3xl text-black'>Profile</h1>
          <p className='mt-1'>Basic info, for a faster booking experience</p>
          </div>
           <div>
            <EditButton openModal={openModal} modalName='profileEdit'/>
           </div>
        </div>
          <div className=' mt-8  text-gray-600 text-xs'>
            <ul className='space-y-6'>
              <li>
                <div className='flex mb-3 items-center w-[50%]'>
                  <span className='font-normal flex-1'>NAME</span>
                  <span className='font-extrabold text-lg text-black flex-1 '>{userData?.name ? userData.name : <AddButton openModal={openModal} modalName='profileEdit'/>}</span>
                </div> 
                <hr className="border-gray-300 " />
              </li>
              <li>
                <div className='flex mb-4 items-center w-[50%]'>
                  <span className='font-normal flex-1'>BIRTHDAY</span>
                  <span className='font-extrabold text-base text-black flex-1'>{userData?.birthday ? formatDate(userData.birthday) : <AddButton openModal={openModal} modalName='profileEdit'/>}</span>
                </div>
                <hr className="border-gray-300 " />
              </li>
              <li>
                <div className='flex mb-4 items-center w-[50%]'>
                  <span className='font-normal flex-1'>GENDER</span>
                  <span className='font-extrabold text-base text-black flex-1'>{userData?.gender ? userData.gender : <AddButton openModal={openModal} modalName='profileEdit'/>}</span>
                </div>
                <hr className="border-gray-300 " />
              </li>

              <li>
                <div className='flex mb-4 items-center w-[50%]'>
                  <span className='font-normal flex-1'>ADDRESS</span>
                  <span className='font-extrabold text-lg text-black flex-1'>{userData?.address ? userData.address : <AddButton openModal={openModal} modalName='profileEdit'/>}</span>
                </div>
                <hr className="border-gray-300 " />
              </li>

              <li>
                <div className='flex mb-4 items-center w-[50%]'>
                  <span className='font-normal flex-1'>PIN CODE</span>
                  <span className='font-extrabold text-lg text-black flex-1'>{userData?.pincode ? userData.pincode.toString() : <AddButton openModal={openModal} modalName='profileEdit'/>}</span>
                </div>
                <hr className="border-gray-300 " />
              </li>

              <li>
                <div className='flex mb-4 items-center w-[50%]'>
                  <span className='font-normal flex-1'>STATE</span>
                  <span className='font-extrabold text-lg text-black flex-1'>{userData?.state ? userData.state : <AddButton openModal={openModal} modalName='profileEdit'/>}</span>
                </div>
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