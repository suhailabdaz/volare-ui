import  { useEffect, useState } from 'react';
import AirNavbar from '../../../components/airline/home/AirNavbar';
import FlightList from '../../../components/airline/home/FlightList';
import cloudImage from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import createAxios from '../../../services/axios/AirlineAxios';
import { airlineEndpoints } from '../../../services/endpoints/AirlineEndpoints';
import { setFlights } from '../../../redux/slices/airlineSlice';
import { toast } from 'sonner';
import ProfileShimmer from '../../../components/user/Home/Shimmers/ProfileShimmer';

function Flights() {

  const [isLoading, setIsLoading] = useState(true);
  const authState = useSelector((state: RootState) => state.AirlineAuth.isAuthenticated);
  const airlineData = useSelector(
    (state: RootState) => state.AirlineAuth.airlineData
  );
  const flightData = useSelector((state: RootState)=>state.AirlineAuth.fleet)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFlightsData = async()=>{
      try{
          if(authState && (!flightData || flightData.length===0)){
            const response = await createAxios(dispatch).get(airlineEndpoints.getFlights, {
              params: {
                key: airlineData?._id,
              },
            })
            dispatch(setFlights(response.data.flights));
          }

      }catch(err){
        toast.error("Error getting data");
      } finally {
        setIsLoading(false);
      }
    }
    if(authState && (!flightData || flightData.length===0)){
      fetchFlightsData();
    }else{
      setIsLoading(false);
    }
   
  }, [authState, dispatch, flightData]);

  if (isLoading) {
    return <ProfileShimmer />;
  }


  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AirNavbar/>
    <FlightList/>
  </div>;
}

export default Flights;
