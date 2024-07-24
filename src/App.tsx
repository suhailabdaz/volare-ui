import { Route, Routes } from "react-router-dom";
import UserRoute from "./routes/UserRouter";
import AdminRouter from "./routes/adminRouter";
import AuthorityRoute from "./routes/authorityRouter";

function App ():any {
  return(
    <Routes>
        <Route path="/*" element={<UserRoute />}/>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/authority/*" element={<AuthorityRoute />} />
    </Routes>
  );
}

export default App