import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-10">
        🛠 Admin Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 gap-6">
        <button
          onClick={() => navigate("/admin/newspapers")}
          className="p-6 border rounded-lg hover:shadow transition text-left"
        >
          <h2 className="text-xl font-semibold mb-2">
            📰 Newspaper Management
          </h2>
          <p className="text-gray-600 text-sm">
            Add, enable or disable newspapers
          </p>
        </button>

        <button
          onClick={() => navigate("/admin/live-channels")}
          className="p-6 border rounded-lg hover:shadow transition text-left"
        >
          <h2 className="text-xl font-semibold mb-2">
            📺 Live TV Management
          </h2>
          <p className="text-gray-600 text-sm">
            Manage live YouTube news channels
          </p>
        </button>
      </div>

      <button
        className="mt-10 text-sm text-red-600 hover:underline"
        onClick={() => {
          localStorage.removeItem("admin");
          navigate("/admin/login", { replace: true });
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
