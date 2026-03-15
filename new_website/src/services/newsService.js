const BASE = "http://localhost:8080/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/* ---------- ADULT ---------- */
export const getAdultNews = async () => {
  const res = await fetch(`${BASE}/news/adult`, {
    headers: getAuthHeaders()
  });
  return res.ok ? res.json() : [];
};

/* ---------- KIDS ---------- */
export const getKidsNews = async () => {
  const res = await fetch(`${BASE}/news/kids/today`, {
    headers: getAuthHeaders()
  });
  return res.ok ? res.json() : [];
};

/* ---------- WEEKLY ---------- */
export const getWeeklyAdultSummary = async () => {
  const res = await fetch(`${BASE}/weekly-summary/adult`, {
    headers: getAuthHeaders()
  });
  return res.ok ? res.json() : {};
};

export const getWeeklyKidsSummary = async () => {
  const res = await fetch(`${BASE}/weekly-summary/kids`);
  return res.ok ? res.json() : [];
};

/* ---------- LIVE TV ---------- */
export const getLiveChannels = async () => {
  const res = await fetch(`${BASE}/live-channels`);
  return res.ok ? res.json() : [];
};

/* ---------- NEWSPAPERS ---------- */
export const getNewspapers = async () => {
  const res = await fetch(`${BASE}/newspapers`);
  return res.ok ? res.json() : [];
};

export const addPaper = async (paper) => {
  await fetch("http://localhost:8080/api/admin/newspapers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paper),
  });
};

export const getAllPapersAdmin = async () => {
  const res = await fetch("http://localhost:8080/api/admin/newspapers");
  return res.ok ? res.json() : [];
};

export const deletePaper = async (id) => {
  await fetch(
    `http://localhost:8080/api/admin/newspapers/${id}`,
    { method: "DELETE" }
  );
};

export const togglePaper = async (id) => {
  await fetch(
    `http://localhost:8080/api/admin/newspapers/${id}/toggle`,
    { method: "PUT" }
  );
};

/* ---------- ADMIN LIVE CHANNELS ---------- */

export const getLiveChannelsAdmin = async () => {
  const res = await fetch("http://localhost:8080/api/admin/live-channels");
  return res.ok ? res.json() : [];
};

export const addLiveChannel = async (channel) => {
  await fetch("http://localhost:8080/api/admin/live-channels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(channel),
  });
};

export const deleteLiveChannel = async (id) => {
  await fetch(
    `http://localhost:8080/api/admin/live-channels/${id}`,
    { method: "DELETE" }
  );
};

export const toggleLiveChannel = async (id) => {
  await fetch(
    `http://localhost:8080/api/admin/live-channels/${id}/toggle`,
    { method: "PUT" }
  );
};



