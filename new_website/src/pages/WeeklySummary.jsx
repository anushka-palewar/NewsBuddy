import { useEffect, useState } from "react";
import { getWeeklySummary } from "../services/newsService";
import "./WeeklySummary.css";

const WeeklySummary = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getWeeklySummary().then(setNews);
  }, []);

  return (
    <div className="weekly-container">
      <h1>📅 Weekly News Summary</h1>
      <p className="sub">
        Important news from the last 7 days
      </p>

      {news.length === 0 && <p>No data available</p>}

      {news.map(n => (
        <div key={n.id} className="weekly-card">
          <h3>{n.title}</h3>
          <p className="date">
            📆 {n.publishedDate}
          </p>
          <p>{n.summary}</p>
          <span className="category">{n.category}</span>
        </div>
      ))}
    </div>
  );
};

export default WeeklySummary;
