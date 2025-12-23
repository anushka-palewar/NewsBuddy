import { useEffect, useState } from "react";
import { getKidsNews } from "../services/newsService";
import { useNavigate } from "react-router-dom";

const KidsNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ MOVE HERE (TOP LEVEL)

  useEffect(() => {
    getKidsNews()
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
        Loading kids news…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Kids News</h1>
      <p className="text-gray-600 mb-8">
        Fun, safe and educational news for children
      </p>

      {news.length === 0 ? (
        <p className="text-gray-500">
          No kids news available today.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(n => (
            <div
              key={n.id}
              onClick={() => navigate(`/article/${n.id}`)} // ✅ CLICK HANDLER
              className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              {/* IMAGE */}
              <img
                src={n.imageUrl || "/fallback.png"}
                alt={n.title}
                onError={(e) => (e.target.src = "/fallback.png")}
                className="w-full h-44 object-cover"
              />

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {n.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-4">
                  {n.summary}
                </p>

                <p className="text-xs text-gray-400 mt-3">
                  {n.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KidsNews;
