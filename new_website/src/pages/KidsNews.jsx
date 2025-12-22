import { useEffect, useState } from "react";
import { getKidsNews } from "../services/newsService";

const KidsNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKidsNews()
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
      <div className="max-w-6xl mx-auto px-6 py-20 text-gray-500">
        Loading kids news…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      
      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-2">
        Kids News
      </h1>

      <p className="text-gray-600 mb-8">
        Easy-to-understand news for students and young readers
      </p>

      {/* EMPTY STATE */}
      {news.length === 0 && (
        <div className="text-gray-500">
          No kids news available today. Please check back later.
        </div>
      )}

      {/* NEWS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map(n => (
          <article
            key={n.id}
            className="border rounded-lg bg-white p-5 hover:shadow transition"
          >
            <h2 className="font-semibold text-lg leading-snug mb-2">
              {n.title}
            </h2>

            <p className="text-sm text-gray-600 line-clamp-4">
              {n.summary}
            </p>

            <div className="mt-4 text-xs text-gray-500 flex justify-between">
              <span>{n.category}</span>
              <span>{n.publishedDate}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default KidsNews;




