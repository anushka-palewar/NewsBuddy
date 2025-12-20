import { useEffect, useState } from "react";
import { getAdultNews } from "../services/newsService";
import AdultNewsCard from "../components/AdultNewsCard";
import "./AdultNews.css";

const AdultNews = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    getAdultNews().then(data => setNewsList(data));
  }, []);

  return (
    <div className="adult-container">
      <h1>📰 Latest News</h1>

      {newsList.length === 0 && <p>No news available</p>}

      <div className="adult-grid">
        {newsList.map(news => (
          <AdultNewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
};

export default AdultNews;
