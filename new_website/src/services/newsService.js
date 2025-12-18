export const getKidsNews = async () => {
  const response = await fetch("http://localhost:8080/api/kids/news");
  return response.json();
};
