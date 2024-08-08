import { useEffect, useState } from 'react';
import SideBar from '../../../components/user/Home/MyProfile/SideBar';
import Content from '../../../components/user/Home/MyProfile/Content';
import ProfileShimmer from '../../../components/user/Home/Shimmers/ProfileShimmer';
import createAxios from '../../../services/axios/UserAxios';
import { userEndpoints } from '../../../services/endpoints/UserEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { toast } from 'sonner';
import { userProfileDetails as Profile } from '../../../redux/slices/profileSlice';
import { useDispatch } from 'react-redux';
import { setTravellers } from '../../../redux/slices/travellersSlice';
import PrNavbar from '../../../components/user/Home/Homepage/PrNavbar';

function SearchResults() {
  const [isLoading, setIsLoading] = useState(true);
  const userState = useSelector((state: RootState) => state.UserAuth.userData);
  const userData = useSelector(
    (state: RootState) => state.ProfileAuth.userData
  );
  const travellersData = useSelector(
    (state: RootState) => state.TravellerAuth.travellers
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTravellersData = async () => {
      try {
        if (userState && (!travellersData || travellersData.length === 0)) {
          const response = await createAxios().get(
            userEndpoints.getTravellers,
            {
              params: { id: userState._id },
            }
          );
          console.log(response.data.travellers);

          dispatch(setTravellers(response.data.travellers));
        }
      } catch (err) {
        toast.error('Error getting data');
      } finally {
        setIsLoading(false);
      }
    };
    const fetchUserData = async () => {
      try {
        if (userState && !userData) {
          const response = await createAxios().get(userEndpoints.getUser, {
            params: { id: userState._id },
          });
          dispatch(Profile(response.data));
        }
      } catch (error) {
        toast.error('Error getting data');
      } finally {
        setIsLoading(false);
      }
    };

    if (userState && !userData) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
    if (userState && (!travellersData || travellersData.length === 0)) {
      fetchTravellersData();
    } else {
      setIsLoading(false);
    }
  }, [userState, userData, dispatch, travellersData]);

  if (isLoading) {
    return <ProfileShimmer />;
  }
  return (
    <div className="bg-[#F6F6F6]">
      <PrNavbar />
      {/* <BreadCrumbs/> */}
      <div className="flex mx-[11%]">
        <div className="w-1/4 ">
          <SideBar />
        </div>
        <div className="w-3/4">
          <Content />
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
