import { Route, Routes } from "react-router-dom";
import PrivateRouter from "../utils/authority/PrivateRouter";
import PublicRouter from "../utils/authority/PublicRouter";
import LoginPage from "../pages/authority/Authentication/LoginPage";
import DashboardPage from "../pages/authority/Home/DashboardPage";
import Airports from "../pages/authority/Home/Airports";
import Schedules from "../pages/authority/Home/Schedules";



const AuthorityRoute = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRouter />}>
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/airports" element={<Airports/>} />
          <Route path="/schedules" element={<Schedules/>} />
        </Route>
        <Route element={<PublicRouter />}>
          <Route path="/" element={<LoginPage/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default AuthorityRoute;
