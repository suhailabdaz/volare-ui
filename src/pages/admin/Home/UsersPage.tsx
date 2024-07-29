import  { useEffect, useState } from 'react';
import AdminNavbar from '../../../components/admin/Home/AdminNavbar';
import UsersList from '../../../components/admin/Home/UsersList';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import createAxios from '../../../services/axios/AuthorityAxios';
import { adminEndpoints} from '../../../services/endpoints/AdminEndpoints';
import { setUsers} from '../../../redux/slices/adminSlice';
import { toast } from 'sonner'
import ProfileShimmer from '../../../components/user/Home/Shimmers/ProfileShimmer';

function UsersPage() {

  const [isLoading, setIsLoading] = useState(true);
  const adminState = useSelector((state: RootState) => state.AdminAuth.isAuthenticated);
  const userData = useSelector((state: RootState) => state.AdminAuth.users)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsersData = async()=>{
      try{
          if(adminState && (!userData || userData.length===0)){
            const response = await createAxios().get(adminEndpoints.getUsers,{
              params:{
                role:"user"
              }
            })
            dispatch(setUsers(response.data.users));
          }

      }catch(err){
        toast.error("Error getting data");
      } finally {
        setIsLoading(false);
      }
    }
    if(adminState && (!userData || userData.length===0)){
      fetchUsersData();
    }else{
      setIsLoading(false);
    }
   
  }, [adminState, dispatch, userData]);

  if (isLoading) {
    return <ProfileShimmer />;
  }


  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AdminNavbar/>
    <UsersList/>
  </div>;
}

export default UsersPage;
