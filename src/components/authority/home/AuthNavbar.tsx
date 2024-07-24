import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { clearAirports, logout,clearSchedules } from '../../../redux/slices/authoritySlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


function AuthNavbar() {

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
          <button onClick={()=>navigate('/authority')}>
        <h1 className="text-3xl font-bold">Airline </h1>
        <h1 className="text-3xl font-bold"> Authority</h1>
        </button>
        </div>
        <div className="space-x-16">
        <button onClick={()=>navigate('/authority/airports')} className="text-lg" >Airports</button>
        <button onClick={()=>navigate('/authority/schedules')} className="text-lg " >Schedules</button>
          <button className="text-xl font-bold p-2 border-2 border-black" onClick={()=>handleLogout()} >Logout</button>
        </div>
      </div>
    </div>
  );
}

export default AuthNavbar;
