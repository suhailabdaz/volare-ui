import { Route, Routes } from "react-router-dom";
import UserRoute from "./routes/UserRouter";
function App ():any {
  return(
    <Routes>
        <Route path="/*" element={<UserRoute />}/>
    </Routes>
  );
}

export default App