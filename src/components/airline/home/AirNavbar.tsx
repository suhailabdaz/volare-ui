import { useDispatch, useSelector } from "react-redux";
import {  airlinelogout as logout } from '../../../redux/slices/airlineSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../redux/store/store';
import airlineApi from "../../../redux/apis/airlineApiSlice";


function AirNavbar() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const airlineData = useSelector((state:RootState)=>state.AirlineAuth.airlineData)


  const handleLogout = (): void => {
    try {      
      dispatch(logout())
      dispatch(airlineApi.util.invalidateTags([{ type: 'Schedule' }]));
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error occurred. Please try again!!");
    }
  };


  const handleSelect = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (value === "cancellation") {
      navigate('/airline/cancellation-policies');
    } else if (value === "baggage") {
      navigate('/airline/baggage-policies');
    }  else if (value === "meals") {
      navigate('/airline/meals-menu');
    } 
  };



  return (
    <div className="mx-[11%] pt-8 pb-3 border-b-2 text-white border-white bg-transparent font-Durk_bold_italic_1000">
      <div className="flex justify-between items-center">
        <div>
          <button onClick={()=>navigate('/airline')}>
        <h1 className="text-3xl font-bold">{airlineData?.airline_name} </h1>
        </button>
        </div>
        <div className="flex space-x-16">
        <div>
  <select 
    onChange={handleSelect} 
    className="text-lg p-2 rounded bg-transparent text-white focus:rounded-md  focus:bg-purple-950 focus:outline-none  transition duration-200 ease-in-out"
  >
    <option value="" selected  disabled>Policies & Meals</option>
    <option value="cancellation">Refund Policies</option>
    <option value="baggage">Baggage Policies</option>
    <option value="meals">Meals Array</option>
  </select>
</div>
        <button onClick={()=>navigate('/airline/flights')} className="text-lg" >Fleet</button>
        <button onClick={()=>navigate('/airline/schedules')} className="text-lg " >Schedules</button>
          <button className="text-xl font-bold p-2 border-2 border-white" onClick={()=>handleLogout()} >Logout</button>
        </div>
      </div>
    </div>
  );
}

export default AirNavbar;
