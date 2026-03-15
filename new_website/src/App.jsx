import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route path="/kids" element={
            <ProtectedRoute allowedRoles={['CHILD', 'ADMIN']}>
              <KidsNews />
            </ProtectedRoute>
          } />
          <Route path="/adult" element={
            <ProtectedRoute allowedRoles={['ADULT', 'ADMIN']}>
              <AdultNews />
            </ProtectedRoute>
          } />
          <Route path="/newspapers" element={
            <ProtectedRoute allowedRoles={['ADULT', 'ADMIN']}>
              <Newspapers />
            </ProtectedRoute>
          } />
          <Route path="/live" element={<LiveNews />} />
          <Route path="/weekly" element={<WeeklySummary />} />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/newspapers" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminNewspapers />
            </ProtectedRoute>
          } />
          <Route path="/admin/live-channels" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLiveChannels />
            </ProtectedRoute>
          } />

          <Route path="/search" element={<SearchResults />} />
          <Route path="/article/:id" element={<Article />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;



