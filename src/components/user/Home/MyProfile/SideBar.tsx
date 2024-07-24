import  { useState } from 'react';
import { logout } from '../../../../redux/slices/userSlice';

import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { UserIcon} from '@heroicons/react/24/outline'
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { WalletIcon } from '@heroicons/react/24/outline';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { Link as ScrollLink } from "react-scroll";
import {logout as profilelogout} from '../../../../redux/slices/profileSlice'
import { PencilIcon } from '@heroicons/react/24/outline';
import { clearTravellers } from '../../../../redux/slices/travellersSlice';

function Sidebar() {
  const [currentOption, setCurrentOption] = useState<string>("profile");
  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      console.log("called");
      dispatch(logout())
      dispatch(profilelogout())
      dispatch(clearTravellers())
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error occurred. Please try again!!");
    }
  };
  return (
    <div className=" bg-[#FFFF] rounded-2xl mt-14  w-[95%] left-0 top-10 sticky shadow-custom font-PlusJakartaSans ">
      <div className="p-6">
        {/* User Image */}
        <div className="mb-4 bg-gradient-to-t from-[#2D6DD7] to-[#84CBFF] w-[70%] mx-auto rounded-xl h-36 flex justify-center items-center relative">
  <div>
    <UserIcon className="text-white h-14" />
  </div>
  <button>
  <div className="bg-slate-400 h-8 w-8 flex border-2 border-white justify-center items-center rounded-full absolute -right-2 bottom-[8px]">
    <PencilIcon className="text-white p-1.5" />
  </div>
  </button>
</div>

        {/* Sidebar Sections */}
        <nav className=' flex justify-center mt-6 text-sm'>
          <ul className="space-y-6 ">

<div className={`flex ${currentOption === 'profile' ? 'bg-blue-100 text-blue-800  py-1 rounded-md' : 'text-gray-800'}`}>
  
  <li className='flex'>
    <UserIcon className='h-6 mr-4'/>
    <ScrollLink to="profile" spy={true} smooth={true} duration={500} onClick={() => setCurrentOption('profile')}>
      My Profile
    </ScrollLink>
  </li>
</div>

<div className={`flex ${currentOption === 'login' ? 'bg-blue-100 text-blue-800 p-1 rounded-md' : 'text-gray-800'}`}>
  <li className='flex'>
    <ClipboardDocumentCheckIcon className='h-6 mr-4'/>
    <ScrollLink to="loginDetails" spy={true} smooth={true} duration={500} onClick={() => setCurrentOption('login')}>
      My Login Details
    </ScrollLink>
  </li>
</div>

<div className={`flex ${currentOption === 'travellers' ? 'bg-blue-100 text-blue-800  py-1 rounded-md' : 'text-gray-800'}`}>
  <li className='flex'>
    <UserGroupIcon className='h-6 mr-4'/>
    <ScrollLink to="myTravellers" spy={true} smooth={true} duration={500} onClick={() => setCurrentOption('travellers')}>
      My Travellers
    </ScrollLink>
  </li>
</div>

<div className={`flex ${currentOption === 'wallets' ? 'bg-blue-200 text-blue-800  py-1 rounded-md' : 'text-gray-800'}`}>
  <li className='flex'>
    <WalletIcon className='h-6 mr-4'/>
    <ScrollLink to="myWallet" spy={true} smooth={true} duration={500} onClick={() => setCurrentOption('wallets')}>
      My Wallet
    </ScrollLink>
  </li>
</div>

            <li className='flex'>
            <ArrowRightStartOnRectangleIcon className='h-6 mr-4'/>
            <button
            className=" font-semibold   text-gray-800"
            onClick={() => handleLogout()}
            >
    Logout
  </button>
</li>          </ul>
        </nav>
      </div>
    </div>
    
  );
}

export default Sidebar;
