import { Route, Routes } from "react-router-dom";
import PrivateRouter from "../utils/admin/PrivateRouter";
import PublicRouter from "../utils/admin/PublicRouter";
import LoginPage from "../pages/admin/Authentication/LoginPage";
import DashboardPage from "../pages/admin/Home/DashboardPage";
import UsersPage from "../pages/admin/Home/UsersPage";
import CouponsPage from "../pages/admin/Home/CouponsPage";
import BannerPage from "../pages/admin/Home/BannersPage";
const AdminRoute = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRouter />}>
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/users" element={<UsersPage/>} />
          <Route path="/coupons" element={<CouponsPage/>} />
          <Route path="/banners" element={<BannerPage/>} />
        </Route>
        <Route element={<PublicRouter />}>
          <Route path="/" element={<LoginPage/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default AdminRoute;
