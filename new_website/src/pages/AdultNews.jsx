import { useEffect, useState } from "react";
import { getAdultNews } from "../services/newsService";

const AdultNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdultNews()
      .then(data => {
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          setNews([]);
        }
      })
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-gray-500">
        Loading latest news…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-2">
        Latest News
      </h1>

      <p className="text-gray-600 mb-8">
        National, international and current affairs
      </p>

      {/* EMPTY STATE */}
      {news.length === 0 && (
        <div className="text-gray-500">
          No news available at the moment.
        </div>
      )}

      {/* NEWS LIST */}
      <div className="space-y-8">
        {news.map(n => (
          <article
            key={n.id}
            className="border-b pb-6"
          >
            <h2 className="text-xl font-semibold leading-snug">
              {n.title}
            </h2>

            <div className="text-xs text-gray-500 mt-1">
              <span>{n.category}</span>
              <span className="mx-2">•</span>
              <span>{n.publishedDate}</span>
            </div>

            <p className="text-gray-700 mt-3 leading-relaxed">
              {n.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdultNews;



