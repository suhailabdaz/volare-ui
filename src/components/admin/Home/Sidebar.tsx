import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/adminSlice';
import { adminAxios } from '../../../services/axios/AdminAxios';
import { adminEndpoints } from '../../../services/endpoints/AdminEndpoints';
import { toast } from 'sonner';


function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      const response = await adminAxios.post(adminEndpoints.logout);
      console.log("response for logout", response);
      if (response.data.success) {
        dispatch(logout());
        setTimeout(()=>navigate('/admin'),1000)
      } else {
        toast.error("Error occurred. Please try again!!");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error occurred. Please try again!!");
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 p-4 flex flex-col space-y-4">
      <button className="hover:bg-gray-700 p-2 rounded">Users</button>
      <button className="hover:bg-gray-700 p-2 rounded">Airlines</button>
      <button className="hover:bg-gray-700 p-2 rounded">Airports</button>
      <button 
        onClick={handleLogout} 
        className="mt-auto hover:bg-gray-700 p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
