import { useEffect, useState } from "react";
import { getNewspapers } from "../services/newsService";

const Newspapers = () => {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    getNewspapers().then(setPapers);
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>📰 Newspapers & e-Papers</h1>

      {papers.map(p => (
        <div key={p.id} style={{ marginBottom: "15px" }}>
          <h3>{p.name}</h3>
          <p>Language: {p.language}</p>
          <a href={p.url} target="_blank" rel="noreferrer">
            {p.type === "PDF" ? "📄 Open e-Paper" : "🌐 Visit Website"}
          </a>
        </div>
      ))}
    </div>
  );
};

export default Newspapers;
