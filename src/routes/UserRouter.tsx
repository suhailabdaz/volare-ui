import { Route, Routes } from "react-router-dom";
import PrivateRouter from "../utils/user/PrivateRouter";
import PublicRouter from "../utils/user/PublicRouter";
import HomePage from "../pages/user/Home/HomePage";
import MyprofilePage from "../pages/user/Home/MyprofilePage";
import ReviewDetails from "../pages/user/Home/ReviewDetails";
import SearchResults from "../pages/user/Home/SearchResults";
import SeatSelection from "../pages/user/Home/SeatSelection";
import MytripsPage from "../pages/user/Home/MytripsPage";


const UserRoute = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRouter />}>
          <Route path="/profile" element={<MyprofilePage />} />
          <Route path="/review-details/:bookingId" element={<ReviewDetails />} />
          <Route path="/seat-selection/:bookingId" element={<SeatSelection />} />
          <Route path="/my-trips/" element={<MytripsPage />} />
        </Route>
        <Route element={<PublicRouter />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:from/:to/:date/:class/:adults/:children/:infants/:fareType/:triptype/:returnDate?" element={<SearchResults />} />
          </Route>
      </Routes>
    </>
  );
};

export default UserRoute;
