import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdultNews } from "../services/newsService";

const AdultNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAdultNews()
      .then(data => {
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          setNews([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading latest news…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Latest News</h1>
      <p className="text-gray-600 mb-8">
        National, international and current affairs
      </p>

      {news.length === 0 ? (
        <p className="text-gray-500">
          No news available.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(n => (
            <div
              key={n.id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              {/* IMAGE (CLICKABLE) */}
              <img
                src={n.imageUrl || "/fallback.png"}
                alt={n.title}
                onError={(e) => (e.target.src = "/fallback.png")}
                onClick={() => navigate(`/article/${n.id}`)}
                className="w-full h-48 object-cover cursor-pointer"
              />

              {/* CONTENT */}
              <div className="p-4">
                <h3
                  className="font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/article/${n.id}`)}
                >
                  {n.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-4">
                  {n.summary}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-400">
                    {n.category}
                  </span>

                  <span className="text-xs text-gray-400">
                    {n.publishedDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdultNews;
