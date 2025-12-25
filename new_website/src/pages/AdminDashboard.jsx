import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 text-xl font-bold text-black">
          NewsBuddy
        </div>

        <nav className="px-4 space-y-2">
          <button
            onClick={() => navigate("/admin/newspapers")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            📰 Newspaper Management
          </button>

          <button
            onClick={() => navigate("/admin/live-news")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            📺 Live Channel Management
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("admin");
              navigate("/admin/login");
            }}
            className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-100"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DashboardCard
            title="Newspaper Management"
            onClick={() => navigate("/admin/newspapers")}
          />
          <DashboardCard
            title="Live Channel Management"
            onClick={() => navigate("/admin/live-channels")}
          />
        </div>
      </main>
    </div>
  );
};

const DashboardCard = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-white rounded-xl shadow p-6 hover:shadow-md transition"
  >
    <h3 className="text-gray-700 text-sm">
      Manage
    </h3>
    <p className="text-lg font-semibold mt-2">
      {title}
    </p>
  </div>
);

export default AdminDashboard;

