import { useDispatch } from "react-redux";
import {  logout,clearUsers } from '../../../redux/slices/adminSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


function AuthNavbar() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = (): void => {
    try {      
      dispatch(logout())
      dispatch(clearUsers())
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
          <button className='text-left' onClick={()=>navigate('/admin')}>
        <h1 className="text-3xl font-bold">Volare </h1>
        <h1 className="text-3xl font-bold"> Administration</h1>
        </button>
        </div>
        <div className="space-x-16">
        <button onClick={()=>navigate('/admin/users')} className="text-lg" >Users</button>
        <button onClick={()=>navigate('/admin/airlines')} className="text-lg " >Airlines</button>
          <button className="text-xl font-bold p-2 border-2 border-black" onClick={()=>handleLogout()} >Logout</button>
        </div>
      </div>
    </div>
  );
}

export default AuthNavbar;
