import { useDispatch } from "react-redux";
import { clearAirports, logout,clearSchedules } from '../../../redux/slices/authoritySlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from "../../admin/Home/Modals/ConfirmModal";
import { useState } from "react";


function AuthNavbar() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = (): void => {
    try {      
      dispatch(logout())
      dispatch(clearAirports())
      dispatch(clearSchedules())
      localStorage.removeItem("authorityAccessToken")
      localStorage.removeItem("authorityRefreshToken")
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error occurred. Please try again!!");
    }
  };



  return (
    <div className="mx-[11%] pt-8 pb-3 border-b-2 border-black bg-transparent font-PlayfairDisplay">
      <div className="flex justify-between items-center">
        <div>
          <button className='text-left' onClick={()=>navigate('/authority/dashboard')}>
        <h1 className="text-3xl font-bold"> Airline</h1>
        <h1 className="text-3xl font-bold"> Authority (DGCA)</h1>
        </button>
        </div>
        <div className="space-x-16">
        <button onClick={()=>navigate('/authority/airlines')} className="text-lg " >Airlines</button>
        <button onClick={()=>navigate('/authority/airports')} className="text-lg" >Airports</button>
        <button onClick={()=>navigate('/authority/schedules')} className="text-lg " >Schedules</button>
        <button onClick={()=>navigate('/authority/flight-chart')} className="text-lg " >Flight Chart</button>
          <button className="text-xl font-bold p-2 border-2 border-black" onClick={() => setShowConfirmModal(true)}  >Logout</button>
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
