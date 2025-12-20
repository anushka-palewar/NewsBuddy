import { useEffect, useState } from "react";
import { getWeeklyAdultSummary } from "../services/newsService";
import "./WeeklySummary.css";

const WeeklySummaryAdult = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    getWeeklyAdultSummary().then(setData);
  }, []);

  return (
    <div className="weekly-container">
      <h1>📅 Weekly Adult Summary</h1>

      {Object.keys(data).map(category => (
        <div key={category}>
          <h2 className="cat-title">{category}</h2>

          {data[category].map(n => (
            <div key={n.id} className="weekly-card">
              <h3>{n.title}</h3>
              <p className="date">{n.publishedDate}</p>
              <p>{n.summary}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeeklySummaryAdult;
