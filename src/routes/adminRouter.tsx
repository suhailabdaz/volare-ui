import { Route, Routes } from "react-router-dom";
import PrivateRouter from "../utils/admin/PrivateRouter";
import PublicRouter from "../utils/admin/PublicRouter";
import LoginPage from "../pages/admin/Authentication/LoginPage";
import DashboardPage from "../pages/admin/Home/DashboardPage";
import UsersPage from "../pages/admin/Home/UsersPage";

const AdminRoute = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRouter />}>
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/users" element={<UsersPage/>} />
        </Route>
        <Route element={<PublicRouter />}>
          <Route path="/" element={<LoginPage/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default AdminRoute;
