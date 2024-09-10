import { Route, Routes } from 'react-router-dom';
import PrivateRouter from '../utils/airline/PrivateRouter';
import PublicRouter from '../utils/airline/PublicRouter';
import LoginPage from '../pages/airline/Authentication/LoginPage';
import DashboardPage from '../pages/airline/Home/DashboardPage';
import Flights from '../pages/airline/Home/Flights';
import Freeschedules from '../pages/airline/Home/Freeschedules';
import MySchedules from '../pages/airline/Home/Myschedules'
import CancellationPolicies from '../pages/airline/Home/CancellationPolicies';
import BaggagePolicies from '../pages/airline/Home/BaggagePolicies';
import MealsMenu from '../pages/airline/Home/MealsMenu';

const AirlineRoute = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRouter />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/available-schedules" element={<Freeschedules/>} />
          <Route path="/schedules" element={<MySchedules/>} />
          <Route path="/baggage-policies" element={<BaggagePolicies/>} />
          <Route path="/cancellation-policies" element={<CancellationPolicies/>} />
          <Route path="/meals-menu" element={<MealsMenu/>} />
        </Route>
        <Route element={<PublicRouter />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default AirlineRoute;
