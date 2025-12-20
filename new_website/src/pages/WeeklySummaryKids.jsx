import { useEffect, useState } from "react";
import { getWeeklyKidsSummary } from "../services/newsService";
import "./WeeklySummary.css";

const WeeklySummaryKids = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getWeeklyKidsSummary().then(setNews);
  }, []);

  return (
    <div className="weekly-container">
      <h1>🧒 Kids Weekly Summary</h1>

      {news.map(n => (
        <div key={n.id} className="weekly-card">
          <h3>{n.title}</h3>
          <p className="date">{n.publishedDate}</p>
          <p>{n.summary}</p>
        </div>
      ))}
    </div>
  );
};

export default WeeklySummaryKids;
