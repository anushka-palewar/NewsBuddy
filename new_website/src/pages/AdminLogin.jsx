import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await fetch(
      "http://localhost:8080/api/admin/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      }
    );

    const ok = await res.json();

    if (ok) {
      localStorage.setItem("admin", "true");
      navigate("/admin/newspapers");
    } else {
      setError("Wrong password");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>🔐 Admin Login</h2>

      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <br /><br />
      <button onClick={login}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminLogin;
