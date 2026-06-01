import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getLiveChannelsAdmin,
  addLiveChannel,
  deleteLiveChannel,
  toggleLiveChannel,
} from "../services/newsService";
import AdminLayout from "../components/AdminLayout";

const AUDIENCES = [
  { label: "Kids", value: "CHILD" },
  { label: "Adult", value: "ADULT" },
];

const AdminLiveChannels = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAudience = searchParams.get("audience") || "ADULT";

  const [audience, setAudience] = useState(initialAudience);
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState({
    name: "",
    language: "Hindi",
    youtubeUrl: "",
    audience: initialAudience,
  });

  const load = () => getLiveChannelsAdmin(audience).then(setChannels);

  useEffect(() => {
    setSearchParams({ audience });
    load();
  }, [audience]);

  const submit = async () => {
    if (!form.name || !form.youtubeUrl) {
      alert("Channel name and YouTube URL required");
      return;
    }

    if (typeof form.youtubeUrl !== "string" || !form.youtubeUrl.includes("youtube")) {
      alert("Enter a valid YouTube URL");
      return;
    }

    await addLiveChannel(form);
    setForm({ name: "", language: "Hindi", youtubeUrl: "", audience });
    load();
  };

  return (
    <AdminLayout title="Live TV Management" subtitle="Manage live channel feeds for Kids and Adult users">
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
        <h3 className="font-semibold mb-4">Add Live Channel</h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <input
            placeholder="Channel Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border px-3 py-2 rounded"
          />

          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option>Hindi</option>
            <option>English</option>
            <option>Marathi</option>
          </select>

          <input
            placeholder="YouTube Live URL"
            value={form.youtubeUrl}
            onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
            className="border px-3 py-2 rounded sm:col-span-2"
          />

          <button
            onClick={submit}
            className="bg-black text-white px-4 py-2 rounded sm:col-span-4 w-fit"
          >
            ➕ Add Channel
          </button>
        </div>

        <hr className="my-6" />

        <h3 className="font-semibold mb-4">Existing Channels</h3>

        {channels.length === 0 && (
          <p className="text-sm text-gray-500">No channels added yet.</p>
        )}

        <div className="space-y-3">
          {channels.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-500">
                  Language: {c.language} • Audience: {c.audience || "—"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    c.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {c.active ? "Active" : "Disabled"}
                </span>

                <button
                  onClick={async () => {
                    await toggleLiveChannel(c.id);
                    load();
                  }}
                  className="text-sm px-3 py-1 border rounded"
                >
                  {c.active ? "Disable" : "Enable"}
                </button>

                <button
                  onClick={async () => {
                    await deleteLiveChannel(c.id);
                    load();
                  }}
                  className="text-sm px-3 py-1 border rounded text-red-600"
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

export default AdminLiveChannels;
