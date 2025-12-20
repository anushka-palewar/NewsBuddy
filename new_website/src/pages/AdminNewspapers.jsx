import { useEffect, useState } from "react";
import {
  getAllPapersAdmin,
  addPaper,
  deletePaper,
  togglePaper
} from "../services/newsService";
import { useNavigate } from "react-router-dom";

const AdminNewspapers = () => {
  const [papers, setPapers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    language: "English",
    format: "WEBSITE",
    url: ""
  });

  const load = () => getAllPapersAdmin().then(setPapers);

  useEffect(() => { load(); }, []);

  const submit = async () => {
    await addPaper(form);
    setForm({ name: "", language: "English", format: "WEBSITE", url: "" });
    load();
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin/login");
    }
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <button
  style={{
    float: "right",
    background: "#d32f2f",
    color: "white",
    padding: "6px 12px",
    border: "none",
    cursor: "pointer"
  }}
  onClick={() => {
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  }}
>
  🚪 Logout
</button>

      <h1>🛠 Admin – Newspapers</h1>

      <h3>Add Newspaper</h3>
      <input placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <select
        value={form.language}
        onChange={e => setForm({ ...form, language: e.target.value })}
      >
        <option>English</option>
        <option>Hindi</option>
        <option>Marathi</option>
      </select>

      <select
        value={form.format}
        onChange={e => setForm({ ...form, format: e.target.value })}
      >
        <option>WEBSITE</option>
        <option>PDF</option>
      </select>

      <input placeholder="URL"
        value={form.url}
        onChange={e => setForm({ ...form, url: e.target.value })}
      />

      <button onClick={submit}>Add</button>

      <hr />

      <h3>Existing Newspapers</h3>

      {papers.map(p => (
        <div key={p.id} style={{ marginBottom: "10px" }}>
          <b>{p.name}</b> ({p.language}) [{p.format}]
          <button onClick={() => togglePaper(p.id)}>
            {p.active ? "Disable" : "Enable"}
          </button>
          <button onClick={() => deletePaper(p.id)}>Delete</button>
        </div>
      ))}

      
    </div>
  );
};

export default AdminNewspapers;
