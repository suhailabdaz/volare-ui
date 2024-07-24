import React, { useEffect, useState } from 'react';
import AuthNavbar from '../../../components/authority/home/AuthNavbar';
import AirportsList from '../../../components/authority/home/AirportsList';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import createAxios from '../../../services/axios/AuthorityAxios';
import { authorityEndpoints } from '../../../services/endpoints/AuthorityEndpoints';
import { setAirports } from '../../../redux/slices/authoritySlice';
import { toast } from 'sonner';
import ProfileShimmer from '../../../components/user/Home/Shimmers/ProfileShimmer';

function Airports() {

  const [isLoading, setIsLoading] = useState(true);
  const authState = useSelector((state: RootState) => state.AuthorityAuth.isAuthenticated);
  const airportsData = useSelector((state: RootState)=>state.AuthorityAuth.airports)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAirportsData = async()=>{
      try{
          if(authState && (!airportsData || airportsData.length===0)){
            const response = await createAxios().get(authorityEndpoints.getAirports)
            
            dispatch(setAirports(response.data.airports));
          }

      }catch(err){
        toast.error("Error getting data");
      } finally {
        setIsLoading(false);
      }
    }
    if(authState && (!airportsData || airportsData.length===0)){
      fetchAirportsData();
    }else{
      setIsLoading(false);
    }
   
  }, [authState, dispatch, airportsData]);

  if (isLoading) {
    return <ProfileShimmer />;
  }


  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AuthNavbar/>
    <AirportsList/>
  </div>;
}

export default Airports;
