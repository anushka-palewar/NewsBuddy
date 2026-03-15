import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchResults from "./pages/SearchResults";
import Home from "./pages/Home";
import KidsNews from "./pages/KidsNews";
import AdultNews from "./pages/AdultNews";
import Newspapers from "./pages/Newspapers";
import LiveNews from "./pages/LiveNews";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Article from "./pages/Article";
import WeeklySummary from "./pages/WeeklySummary";
import AdminNewspapers from "./pages/AdminNewspapers";
import AdminLiveChannels from "./pages/AdminLiveChannels";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kids" element={<KidsNews />} />
        <Route path="/adult" element={<AdultNews />} />
        <Route path="/newspapers" element={<Newspapers />} />
        <Route path="/live" element={<LiveNews />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="*" element={<WeeklySummary />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/newspapers" element={<AdminNewspapers />} />
        <Route path="/admin/live-channels" element={<AdminLiveChannels />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;



