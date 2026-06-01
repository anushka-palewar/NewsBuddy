const BASE = "/api";

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

/* ---------- NEWSPAPERS ---------- */
export const getNewspapers = async (audience) => {
  const url = audience
    ? `${BASE}/newspapers?audience=${encodeURIComponent(audience)}`
    : `${BASE}/newspapers`;
  const res = await fetch(url);
  return res.ok ? res.json() : [];
};

export const addPaper = async (paper) => {
  await fetch(`${BASE}/admin/newspapers`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(paper),
  });
};

export const getAdminStatus = async () => {
  const res = await fetch(`${BASE}/admin/status`, {
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : {};
};

export const getAdminUsers = async () => {
  const res = await fetch(`${BASE}/admin/users`, {
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : [];
};

export const getLiveChannels = async (audience) => {
  const url = audience
    ? `${BASE}/live-channels?audience=${encodeURIComponent(audience)}`
    : `${BASE}/live-channels`;
  const res = await fetch(url);
  return res.ok ? res.json() : [];
};

export const getAllPapersAdmin = async (audience) => {
  const url = audience
    ? `${BASE}/admin/newspapers?audience=${encodeURIComponent(audience)}`
    : `${BASE}/admin/newspapers`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : [];
};

export const deletePaper = async (id) => {
  await fetch(`${BASE}/admin/newspapers/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const togglePaper = async (id) => {
  await fetch(`${BASE}/admin/newspapers/${id}/toggle`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
};

/* ---------- ADMIN LIVE CHANNELS ---------- */

export const getLiveChannelsAdmin = async (audience) => {
  const url = audience
    ? `${BASE}/admin/live-channels?audience=${encodeURIComponent(audience)}`
    : `${BASE}/admin/live-channels`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : [];
};

export const addLiveChannel = async (channel) => {
  await fetch(`${BASE}/admin/live-channels`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(channel),
  });
};

export const deleteLiveChannel = async (id) => {
  await fetch(`${BASE}/admin/live-channels/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const toggleLiveChannel = async (id) => {
  await fetch(`${BASE}/admin/live-channels/${id}/toggle`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
};

/* ---------- AI DIGEST ---------- */
export const getAiDailyDigest = async () => {
  const res = await fetch(`${BASE}/ai-digest/today`, {
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : null;
};

export const getAiWeeklyDigest = async () => {
  const res = await fetch(`${BASE}/ai-digest/weekly`, {
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : null;
};

export const generateAiDailyDigest = async () => {
  const res = await fetch(`${BASE}/ai-digest/generate-today`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : null;
};

export const generateAiWeeklyDigest = async () => {
  const res = await fetch(`${BASE}/ai-digest/generate-weekly`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : null;
};

/* ---------- DAILY QUIZ ---------- */
export const getTodayQuiz = async () => {
  const res = await fetch(`${BASE}/quiz/today`, {
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : [];
};

export const submitQuizAnswers = async (answers) => {
  const res = await fetch(`${BASE}/quiz/submit`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return res.ok ? res.json() : null;
};

export const getQuizHistory = async () => {
  const res = await fetch(`${BASE}/quiz/history`, {
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : [];
};

export const getWeeklyLeaderboard = async () => {
  const res = await fetch(`${BASE}/quiz/leaderboard`, {
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : [];
};

export const generateQuizManually = async () => {
  const res = await fetch(`${BASE}/quiz/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return res.ok ? res.json() : null;
};

/* ---------- DISCOVER ---------- */
export const getTopics = async () => {
  const res = await fetch(`${BASE}/discover/topics`);
  return res.ok ? res.json() : [];
};

export const getArticlesByTopic = async (topicId, page = 0, size = 10) => {
  const res = await fetch(`${BASE}/discover/topics/${topicId}/articles?page=${page}&size=${size}`);
  return res.ok ? res.json() : { content: [], totalPages: 0 };
};

export const getTrendingTopics = async () => {
  const res = await fetch(`${BASE}/discover/trending`);
  return res.ok ? res.json() : [];
};
