const BASE = "http://localhost:8080/api";

/* ---------- ADULT ---------- */
export const getAdultNews = async () => {
  const res = await fetch(`${BASE}/news/adult`);
  return res.ok ? res.json() : [];
};

/* ---------- KIDS ---------- */
export const getKidsNews = async () => {
  const res = await fetch(`${BASE}/news/kids/today`);
  return res.ok ? res.json() : [];
};

/* ---------- WEEKLY ---------- */
export const getWeeklyAdultSummary = async () => {
  const res = await fetch(`${BASE}/weekly-summary/adult`);
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



