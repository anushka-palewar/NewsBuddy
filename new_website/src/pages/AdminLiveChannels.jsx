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

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin/login");
    }
    load();
  }, []);

  const load = () => getLiveChannelsAdmin().then(setChannels);

  const submit = async () => {
  if (!form.name || !form.youtubeUrl) {
    alert("Channel name and YouTube URL required");
    return;
  }

  if (!form.youtubeUrl.includes("youtube")) {
    alert("Enter a valid YouTube URL");
    return;
  }

  await addLiveChannel(form);
  setForm({ name: "", language: "Hindi", youtubeUrl: "" });
  load();
};


  return (
    <div style={{ padding: "30px" }}>
      <h1>📺 Admin – Live News Channels</h1>

      <button
        onClick={() => {
          localStorage.removeItem("admin");
          window.location.href = "/admin/login";
        }}
      >
        🚪 Logout
      </button>

      <h3>Add Channel</h3>

      <input
        placeholder="Channel Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <select
        value={form.language}
        onChange={e => setForm({ ...form, language: e.target.value })}
      >
        <option>Hindi</option>
        <option>English</option>
        <option>Marathi</option>
      </select>

      <input
        placeholder="YouTube Live URL"
        value={form.youtubeUrl}
        onChange={e => setForm({ ...form, youtubeUrl: e.target.value })}
      />

      <button onClick={submit}>Add</button>

      <hr />

      {channels.map(c => (
        <div key={c.id} style={{ marginBottom: "10px" }}>
          <b>{c.name}</b> ({c.language})
          <button onClick={() => toggleLiveChannel(c.id)}>
            {c.active ? "Disable" : "Enable"}
          </button>
          <button onClick={() => deleteLiveChannel(c.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminLiveChannels;
