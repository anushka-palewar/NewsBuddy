import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLiveChannelsAdmin,
  addLiveChannel,
  deleteLiveChannel,
  toggleLiveChannel
} from "../services/newsService";

const AdminLiveChannels = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState({
    name: "",
    language: "Hindi",
    youtubeUrl: ""
  });

  const load = () => getLiveChannelsAdmin().then(setChannels);

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin/login");
      return;
    }
    load();
  }, [navigate]);

  const submit = async () => {
    if (!form.name || !form.youtubeUrl) {
      alert("Channel name and YouTube URL required");
      return;
    }

    if (
      typeof form.youtubeUrl !== "string" ||
      !form.youtubeUrl.includes("youtube")
    ) {
      alert("Enter a valid YouTube URL");
      return;
    }

    await addLiveChannel(form);
    setForm({ name: "", language: "Hindi", youtubeUrl: "" });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mr-4 text-sm text-gray-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold">
          Live Channel Management
        </h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow p-6">

        {/* Add Channel */}
        <h3 className="font-semibold mb-4">
          Add Live Channel
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <input
            placeholder="Channel Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />

          <select
            value={form.language}
            onChange={(e) =>
              setForm({ ...form, language: e.target.value })
            }
            className="border px-3 py-2 rounded"
          >
            <option>Hindi</option>
            <option>English</option>
            <option>Marathi</option>
          </select>

          <input
            placeholder="YouTube Live URL"
            value={form.youtubeUrl}
            onChange={(e) =>
              setForm({ ...form, youtubeUrl: e.target.value })
            }
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

        {/* Channel List */}
        <h3 className="font-semibold mb-4">
          Existing Channels
        </h3>

        {channels.length === 0 && (
          <p className="text-sm text-gray-500">
            No channels added yet.
          </p>
        )}

        <div className="space-y-3">
          {channels.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
            >
              <div>
                <p className="font-medium">
                  {c.name}
                </p>
                <p className="text-sm text-gray-500">
                  Language: {c.language}
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
    </div>
  );
};

export default AdminLiveChannels;
