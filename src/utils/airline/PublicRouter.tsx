import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Navigate, Outlet } from "react-router-dom";


const PublicRouter =()=>{
  const isAuthenticated = useSelector((state: RootState) => state.AirlineAuth.token);
  return isAuthenticated ?<Navigate to="/airline/dashboard" replace />: <Outlet />  ;
}

export default PublicRouter 