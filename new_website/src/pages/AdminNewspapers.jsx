import { useEffect, useState } from "react";
import {
  getAllPapersAdmin,
  addPaper,
  deletePaper,
  togglePaper
} from "../services/newsService";
import { useNavigate } from "react-router-dom";

const AdminNewspapers = () => {
  const navigate = useNavigate();

  const [papers, setPapers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    language: "English",
    format: "WEBSITE",
    url: "",
    imageUrl: ""
  });

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const load = async () => {
    const data = await getAllPapersAdmin();
    setPapers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.name || !form.url || !form.imageUrl) {
      alert("All fields are required");
      return;
    }
    await addPaper(form);
    setForm({
      name: "",
      language: "English",
      format: "WEBSITE",
      url: "",
      imageUrl: ""
    });
    load();
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mr-4 text-sm text-gray-600 hover:underline"
      >
        ← Back to Dashboard
      </button>
      {/* Header */}
      <div style={styles.header}>
        <h1>📰 Newspaper Management</h1>
        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem("admin");
            navigate("/admin/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Add Newspaper Card */}
      <div style={styles.card}>
        <h3>Add New Newspaper</h3>

        <div style={styles.formGrid}>
          <input
            style={styles.input}
            placeholder="Newspaper Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            style={styles.input}
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>

          <select
            style={styles.input}
            value={form.format}
            onChange={(e) => setForm({ ...form, format: e.target.value })}
          >
            <option>WEBSITE</option>
            <option>PDF</option>
          </select>

          <input
            style={styles.input}
            placeholder="Newspaper URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Logo Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
        </div>

        <button style={styles.primaryBtn} onClick={submit}>
          ➕ Add Newspaper
        </button>
      </div>

      {/* Existing Newspapers */}
      <div style={styles.card}>
        <h3>Existing Newspapers</h3>

        {papers.length === 0 && <p>No newspapers found</p>}

        {papers.map((p) => (
          <div key={p.id} style={styles.listItem}>
            <div>
              <b>{p.name}</b>
              <div style={{ fontSize: "13px", color: "#555" }}>
                {p.language} • {p.format}
              </div>
            </div>

            <div style={styles.actions}>
              <button
                style={{
                  ...styles.actionBtn,
                  background: p.active ? "#fbc02d" : "#4caf50"
                }}
                onClick={() => {
                  togglePaper(p.id);
                  load();
                }}
              >
                {p.active ? "Disable" : "Enable"}
              </button>

              <button
                style={{ ...styles.actionBtn, background: "#e53935" }}
                onClick={() => {
                  if (window.confirm("Delete this newspaper?")) {
                    deletePaper(p.id);
                    load();
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1100px",
    margin: "auto",
    background: "#f5f7fb",
    minHeight: "100vh"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  logout: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: "4px"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "15px"
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  primaryBtn: {
    background: "#1976d2",
    color: "#fff",
    padding: "10px 18px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #eee"
  },
  actions: {
    display: "flex",
    gap: "8px"
  },
  actionBtn: {
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default AdminNewspapers;
