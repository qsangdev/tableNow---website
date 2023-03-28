import { Route, Routes } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import Menu from "../../pages/Menu";
import Revenue from "../../pages/Revenue";
import Ratings from "../../pages/Ratings";
import Staffs from "../../pages/Staffs";
import Reservation from "../../pages/Reservation";
const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/revenue" element={<Revenue />}></Route>
        <Route path="/menu" element={<Menu />}></Route>
        <Route path="/reservation" element={<Reservation />}></Route>
        <Route path="/staffs" element={<Staffs />}></Route>
        <Route path="/ratings" element={<Ratings />}></Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
