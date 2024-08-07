import { Route, Routes } from 'react-router-dom';
import PrivateRouter from '../utils/airline/PrivateRouter';
import PublicRouter from '../utils/airline/PublicRouter';
import LoginPage from '../pages/airline/Authentication/LoginPage';
import DashboardPage from '../pages/airline/Home/DashboardPage';
import Flights from '../pages/airline/Home/Flights';
import Freeschedules from '../pages/airline/Home/Freeschedules';
import MySchedules from '../pages/airline/Home/Myschedules'

const AirlineRoute = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRouter />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/available-schedules" element={<Freeschedules/>} />
          <Route path="/schedules" element={<Freeschedules/>} />
        </Route>
        <Route element={<PublicRouter />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default AirlineRoute;
