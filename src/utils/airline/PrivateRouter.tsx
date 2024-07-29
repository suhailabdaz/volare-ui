import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {
  const isAuthenticated = useSelector((state: RootState) => state.AirlineAuth.token);
  return isAuthenticated ? <Outlet /> : <Navigate to="/airline" replace />;
};
export default PrivateRouter;