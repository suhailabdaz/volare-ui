import { Route, Routes } from "react-router-dom";
import UserRoute from "./routes/UserRouter";
import AdminRouter from "./routes/adminRouter";
import AuthorityRoute from "./routes/authorityRouter";
import AirlineRoute from "./routes/airlineRouter";

function App ():any {
  return(
    <Routes>
        <Route path="/*" element={<UserRoute />}/>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/authority/*" element={<AuthorityRoute />} />
        <Route path="/airline/*" element={<AirlineRoute />} />
    </Routes>
  );
}

export default App