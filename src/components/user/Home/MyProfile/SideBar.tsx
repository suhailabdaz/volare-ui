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
import userApi from '../../../../redux/apis/userApiSlice';

function Sidebar() {
  const [currentOption, setCurrentOption] = useState<string>('profile');
  const dispatch = useDispatch();
  const userData =   useSelector((state: RootState) => state.ProfileAuth.userData);
  const user_id = useSelector((state: RootState) => state.ProfileAuth.userData?._id);
  const fileInputRef = useRef<HTMLInputElement>(null); // Use the correct type here


  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchImageUrl = async () => {
    try {
      const response = await createAxios(dispatch).get(airlineEndpoints.getImageLink, {
        params: {
          key: userData?.image_link,
        },
      });
      console.log(response);

      setImageUrl(response.data);
      setLoading(false);
      setError(false);
    } catch (error) {
      console.error('Error fetching signed URL:', error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.image_link) {
      fetchImageUrl();
    }
  }, [userData]);

  const handleImageError = async () => {
    try {
      await fetchImageUrl(); 
    } catch (error) {
      console.error('Error retrying signed URL fetch:', error);
    }
  };


  const handleLogout = async () => {
    try {
      dispatch(logout());
      dispatch(profilelogout());
      dispatch(clearTravellers());
      userApi.util.invalidateTags(['searchAirline', 'searchAirports','searchBooking','searchSchedules']);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error occurred. Please try again!!');
    }
  };
  const handleFileUpload = async (event: any) => {
    let isMultipart = true
    const file = event.target.files[0];
    if (file && user_id) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('user_id', user_id);

      try {
        const response = await createAxios(dispatch).post(
          userEndpoints.imageUpload,  formData,
          {
            headers: {
              'Content-Type': isMultipart
                ? 'multipart/form-data'
                : 'application/json',
            },
          }
        );

        if (!response.data.success) {
          toast.warning('Failed to update image')
        }else{
        dispatch(updateProfileImage(response.data))
          toast('Image uploaded successfully!');
          
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Error uploading image. Please try again.');
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className=" bg-[#FFFF] rounded-2xl mt-14  w-[95%] left-0 top-10 sticky shadow-custom font-PlusJakartaSans ">
      <div className="p-6">
       {/* User Image */}
       <div className="mb-4 bg-gradient-to-t from-[#2D6DD7] to-[#84CBFF] w-[70%] mx-auto rounded-xl h-36 flex justify-center items-center relative">
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
          )}
          <button onClick={triggerFileInput}>
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
        <nav className=" flex justify-center mt-6 text-sm">
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
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
