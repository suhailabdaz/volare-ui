import {  useEffect, useRef, useState } from 'react';
import { logout } from '../../../../redux/slices/userSlice';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { UserIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { WalletIcon } from '@heroicons/react/24/outline';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { Link as ScrollLink } from 'react-scroll';
import { logout as profilelogout, updateProfileImage } from '../../../../redux/slices/profileSlice';
import { PencilIcon } from '@heroicons/react/24/outline';
import { clearTravellers } from '../../../../redux/slices/travellersSlice';
import { createAxios } from '../../../../services/axios/UserAxios';
import { userEndpoints } from '../../../../services/endpoints/UserEndpoints';
import { RootState } from '../../../../redux/store/store';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';

function Sidebar() {
 
  
  return (
    <div className=" bg-[#FFFF] h-[70vh] rounded-2xl mt-14  w-[95%] left-0 top-10 sticky shadow-custom font-PlusJakartaSans ">
      <div className="p-6">
        For filter and sort
       {/* User Image */}
       {/* <div className="mb-4 bg-gradient-to-t from-[#2D6DD7] to-[#84CBFF] w-[70%] mx-auto rounded-xl h-36 flex justify-center items-center relative">
          {loading ? (
            <UserIcon className="text-white h-14" />
          ) : error ? (
            <div className="text-red-500">Error loading image</div>
          ) : (
            <img
              src={imageUrl}
              alt="User Profile"
              className="w-full h-full rounded-xl object-fill"
              onError={handleImageError}
            />
          )} */}
          {/* <button onClick={triggerFileInput}>
            <div className="bg-slate-400 h-8 w-8 flex border-2 border-white justify-center items-center rounded-full absolute -right-2 bottom-[8px]">
              <PencilIcon className="text-white p-1.5" />
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        {/* Sidebar Sections */}
        {/* <nav className=" flex justify-center mt-6 text-sm">
          <ul className="space-y-6 ">
            <div
              className={`flex ${
                currentOption === 'profile'
                  ? 'bg-blue-100 text-blue-800  p-1 rounded-md'
                  : 'text-gray-800 bg-white p-1 rounded-md'
              }`}
            >
              <li className="flex hover:cursor-pointer">
                <UserIcon className="h-6 mr-4" />
                <ScrollLink
                  to="profile"
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => setCurrentOption('profile')}
                >
                  My Profile
                </ScrollLink>
              </li>
            </div>
            <div
              className={`flex ${
                currentOption === 'login'
                  ? 'bg-blue-100 text-blue-800 p-1 rounded-md'
                  : 'text-gray-800 bg-white p-1 rounded-md'
              }`}
            >
              <li className="flex hover:cursor-pointer">
                <ClipboardDocumentCheckIcon className="h-6 mr-4" />
                <ScrollLink
                  to="loginDetails"
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => setCurrentOption('login')}
                >
                  My Login Details
                </ScrollLink>
              </li>
            </div>
            <div
              className={`flex ${
                currentOption === 'travellers'
                  ? 'bg-blue-100 text-blue-800  p-1 rounded-md'
                  : 'text-gray-800 bg-white p-1 rounded-md'
              }`}
            >
              <li className="flex hover:cursor-pointer">
                <UserGroupIcon className="h-6 mr-4" />
                <ScrollLink
                  to="myTravellers"
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => setCurrentOption('travellers')}
                >
                  My Travellers
                </ScrollLink>
              </li>
            </div>
            <div
              className={`flex ${
                currentOption === 'wallets'
                  ? 'bg-blue-100 text-blue-800  p-1 rounded-md'
                  : 'text-gray-800 bg-white p-1 rounded-md'
              }`}
            >
              <li className="flex hover:cursor-pointer">
                <WalletIcon className="h-6 mr-4" />
                <ScrollLink
                  to="myWallet"
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => setCurrentOption('wallets')}
                >
                  My Wallet
                </ScrollLink>
              </li>
            </div>
            <li className="flex hover:cursor-pointer">
              <ArrowRightStartOnRectangleIcon className="h-6 mr-4" />
              <button
                className=" font-semibold   text-gray-800"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </li>{' '}
          </ul>
        </nav> */}
      </div>
    </div>
  );
}

export default Sidebar;
