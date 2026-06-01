import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllPapersAdmin,
  addPaper,
  deletePaper,
  togglePaper,
} from "../services/newsService";
import AdminLayout from "../components/AdminLayout";

const AUDIENCES = [
  { label: "Kids", value: "CHILD" },
  { label: "Adult", value: "ADULT" },
];

const AdminNewspapers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialAudience = searchParams.get("audience") || "ADULT";
  const [audience, setAudience] = useState(initialAudience);

  const [papers, setPapers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    language: "English",
    format: "WEBSITE",
    url: "",
    imageUrl: "",
    audience: initialAudience,
  });

  const load = async () => {
    const data = await getAllPapersAdmin(audience);
    setPapers(data);
  };

  useEffect(() => {
    setSearchParams({ audience });
    load();
  }, [audience]);

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
      imageUrl: "",
      audience,
    });
    load();
  };

  return (
    <AdminLayout
      title="Newspaper Management"
      subtitle="Manage newspapers for Kids and Adult audiences"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Audience:</span>
          {AUDIENCES.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setAudience(item.value);
                setForm((current) => ({ ...current, audience: item.value }));
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                audience === item.value
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4">Add New Newspaper</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Newspaper Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            className="border px-3 py-2 rounded"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>

          <select
            className="border px-3 py-2 rounded"
            value={form.format}
            onChange={(e) => setForm({ ...form, format: e.target.value })}
          >
            <option>WEBSITE</option>
            <option>PDF</option>
          </select>

          <input
            className="border px-3 py-2 rounded"
            placeholder="Newspaper URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />

          <input
            className="border px-3 py-2 rounded"
            placeholder="Logo Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <button
            onClick={submit}
            className="bg-black text-white px-4 py-2 rounded w-full sm:col-span-3"
          >
            ➕ Add Newspaper
          </button>
        </div>

        <div className="space-y-3">
          {papers.length === 0 && (
            <p className="text-sm text-gray-500">No newspapers found.</p>
          )}

          {papers.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div>
                <div className="text-lg font-semibold text-gray-900">{p.name}</div>
                <div className="text-sm text-gray-500">
                  {p.language} • {p.format} • Audience: {p.audience || "—"}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    togglePaper(p.id);
                    load();
                  }}
                  className={`px-3 py-1 rounded text-sm font-medium text-white ${
                    p.active ? "bg-amber-500" : "bg-green-600"
                  }`}
                >
                  {p.active ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this newspaper?")) {
                      deletePaper(p.id);
                      load();
                    }
                  }}
                  className="px-3 py-1 rounded text-sm font-medium bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewspapers;
