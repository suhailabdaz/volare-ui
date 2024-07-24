import { Route, Routes } from "react-router-dom"
import DashboardPage from "../pages/admin/Home/DashboardPage";
import LoginPage from "../pages/admin/Authentication/LoginPage";
import PrivateRouter from "../utils/admin/PrivateRouter";
import PublicRouter from "../utils/admin/PublicRouter";



const AdminRouter = () =>{
    return(
        <Routes>
            <Route element={<PublicRouter/>}>
            <Route path="/" element={<LoginPage/>}/>
            </Route>
            <Route element={<PrivateRouter />}>
            <Route path="/dashboard" element={<DashboardPage/>}/>  
            </Route>
        </Routes>
    )
}

export default AdminRouter;