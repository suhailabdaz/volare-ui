import { Route, Routes } from "react-router-dom";
import PrivateRouter from "../utils/airline/PrivateRouter";
import PublicRouter from "../utils/airline/PublicRouter"
import LoginPage from "../pages/airline/Authentication/LoginPage";
import DashboardPage from "../pages/airline/Home/DashboardPage";




const AirlineRoute = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRouter />}>
          <Route path="/dashboard" element={<DashboardPage/>}  />
        </Route>
        <Route element={<PublicRouter />}>
          <Route path="/" element={<LoginPage/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default AirlineRoute;
