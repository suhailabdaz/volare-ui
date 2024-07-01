import {Route,Routes} from "react-router-dom"
import PrivateRouter from "../utils/user/PrivateRouter";
import PublicRouter from "../utils/user/PublicRouter";
import HomePage from "../pages/user/Home/HomePage";


const UserRoute = () => {
  return (
    <Routes>
      <Route element={<PrivateRouter />}>
      </Route>
      <Route element={<PublicRouter />}>
      <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default UserRoute;