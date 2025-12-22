import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>🛠 Admin Dashboard</h1>

      <div style={{ marginTop: "30px" }}>
        <button
          style={{ marginRight: "20px" }}
          onClick={() => navigate("/admin/newspapers")}
        >
          📰 Newspaper Management
        </button>

        <button onClick={() => navigate("/admin/live-channels")}>
          📺 Live TV Management
        </button>
      </div>

      <br />

      <button
        style={{ background: "#d32f2f", color: "white" }}
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

