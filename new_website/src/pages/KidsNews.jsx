import "./KidsNews.css";
import { useEffect, useState } from "react";
import { getKidsNews } from "../services/newsService";
import KidsNewsCard from "../components/KidsNewsCard";

const KidsNews = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    getKidsNews().then(data => setNewsList(data));
  }, []);

  return (
    <div>
      <h1>🧒 Kids News</h1>
      <div className="kids-grid">
        {newsList.map(news => (
          <KidsNewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
};

export default KidsNews;
