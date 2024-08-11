import { useDispatch } from "react-redux";
import {  logout } from '../../../redux/slices/adminSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from "./Modals/ConfirmModal";
import { useState } from "react";


function AuthNavbar() {

  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = (): void => {
    try {      
      dispatch(logout())
      localStorage.removeItem("adminAccessToken")
      localStorage.removeItem("adminRefreshToken")
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error occurred. Please try again!!");
    }
  };

  return (
    <div className="mx-[11%] pt-8 pb-3 border-b-2 border-black bg-transparent font-PlayfairDisplay">
      <div className="flex justify-between items-center">
        <div>
          <button className='text-left' onClick={()=>navigate('/admin/dashboard')}>
        <h1 className="text-3xl font-bold">Volare </h1>
        <h1 className="text-3xl font-bold"> Administration</h1>
        </button>
        </div>
        <div className="space-x-16">
        <button onClick={()=>navigate('/admin/users')} className="text-lg" >Users</button>
        <button onClick={()=>navigate('/admin/coupons')} className="text-lg" >Coupons</button>
        <button onClick={()=>navigate('/admin/banners')} className="text-lg" >Banners</button>

          <button className="text-xl font-bold p-2 border-2 border-black" onClick={() => setShowConfirmModal(true)} >Logout</button>
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          message={`Are u sure you want to Logout?`}
          onConfirm={() => {
            handleLogout();
            setShowConfirmModal(false);
          }}
          onCancel={() => setShowConfirmModal(false)}
          cancelLabel="Cancel"
          confirmLabel="Logout"
        />
      )}
    </div>
  );
}

export default AuthNavbar;
