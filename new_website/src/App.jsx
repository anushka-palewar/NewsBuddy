import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import KidsNews from "./pages/KidsNews";
import AdultNews from "./pages/AdultNews";
import WeeklySummaryAdult from "./pages/WeeklySummaryAdult";
import Newspapers from "./pages/Newspapers";
import AdminNewspapers from "./pages/AdminNewspapers";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kids" element={<KidsNews />} />
        <Route path="/adult" element={<AdultNews />} />
        <Route path="/weekly" element={<WeeklySummaryAdult />} />
        <Route path="/newspapers" element={<Newspapers />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/newspapers" element={<AdminNewspapers />} />

        {/* ✅ ADMIN ROUTE */}
        <Route path="/admin/newspapers" element={<AdminNewspapers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



