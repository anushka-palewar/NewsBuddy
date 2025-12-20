const BASE_URL = "http://localhost:8080";

export const getKidsNews = async () => {
  const res = await fetch(`${BASE_URL}/api/kids/news`);
  return res.json();
};

export const getAdultNews = async () => {
  const res = await fetch(`${BASE_URL}/api/news`);
  return res.json();
};

export const getWeeklyAdultSummary = async () => {
  const res = await fetch("http://localhost:8080/api/weekly-summary/adult");
  return res.json();
};

export const getWeeklyKidsSummary = async () => {
  const res = await fetch("http://localhost:8080/api/weekly-summary/kids");
  return res.json();
};

export const getNewspapers = async () => {
  const res = await fetch("http://localhost:8080/api/newspapers");
  return res.json();
};

export const getAllPapersAdmin = async () => {
  const res = await fetch("http://localhost:8080/api/admin/newspapers");
  return res.json();
};

export const addPaper = async (paper) => {
  await fetch("http://localhost:8080/api/admin/newspapers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paper),
  });
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



